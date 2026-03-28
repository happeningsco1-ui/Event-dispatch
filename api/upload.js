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
    const [fields, files] = await form.parse(req);
    const file = files.file[0]; // The image/video file

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Initialize R2 client
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // Generate unique file name
    const ext = file.originalFilename.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const fileContent = fs.readFileSync(file.filepath);

    // Upload to R2
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
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

    // If there is a record ID provided, update it. If not, just return the URL.
    const { data, error } = await supabase
      .from("media")
      .insert([
        {
          src: publicUrl,
          type: file.mimetype.startsWith("video") ? "video" : "image",
          title: fields.title?.[0] || file.originalFilename,
          cat: fields.cat?.[0] || "Other",
          tags: fields.tags?.[0] ? fields.tags[0].split(",").map(t => t.trim()) : [],
          date: new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      url: publicUrl,
      data: data[0]
    });

  } catch (error) {
    console.error("Upload handler error:", error);
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
}
