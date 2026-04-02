import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

// Disable default Vercel body parsing for multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  try {
    // Promisify the form parsing
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // In formidable v3, the files object structure might vary depending on client implementation.
    // The key is 'file' because we appended 'file' in index.html line 7427.
    // Ensure we handle it robustly.
    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file || (!file.filepath && !file.path)) {
      console.error("No file found in the request or invalid file structure:", files);
      return res.status(400).json({ error: "No file provided or upload was empty." });
    }

    const filePath = file.filepath || file.path;

    // Check environment variables early
    const requiredEnv = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
    const missing = requiredEnv.filter(k => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    }

    // Initialize R2 client
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
      // Some R2 accounts require forcePathStyle: true, but usually auto-endpoint handles it.
    });

    // Generate unique file name
    const originalName = file.originalFilename || "upload";
    const ext = originalName.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const fileContent = fs.readFileSync(filePath);

    // Upload to R2
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype || "application/octet-stream",
    };

    await r2Client.send(new PutObjectCommand(uploadParams));

    // Construct the public URL (ensuring no double slashes)
    const baseUrl = process.env.R2_PUBLIC_URL.replace(/\/$/, ""); 
    const publicUrl = `${baseUrl}/${fileName}`;

    // Update Supabase Database
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Helper to get field value safely (formidable v3 fields are often arrays)
    const getField = (key, def) => {
      const val = fields[key];
      if (Array.isArray(val)) return val[0] || def;
      return val || def;
    };

    const { data, error: dbError } = await supabase
      .from("media")
      .insert([
        {
          src: publicUrl,
          type: (file.mimetype || "").startsWith("video") ? "video" : "image",
          title: getField("title", originalName),
          cat: getField("cat", "Other"),
          tags: getField("tags", "") ? getField("tags", "").split(",").map(t => t.trim()) : [],
          date: new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) throw dbError;

    return res.status(200).json({ 
      success: true, 
      url: publicUrl,
      data: data?.[0]
    });

  } catch (error) {
    console.error("Upload handler error:", error);
    // Explicitly returning JSON to prevent the browser from receiving HTML error pages
    return res.status(500).json({ 
      error: error.message || "Upload failed", 
      details: error.toString() 
    });
  }
}
