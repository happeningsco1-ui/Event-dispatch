import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename, contentType } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const ext = filename.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: contentType || "application/octet-stream",
    });

    // Generate Presigned URL (valid for 1 hour)
    const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    
    // Public URL for later use
    const baseUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, ""); 
    const publicUrl = `${baseUrl}/${uniqueFileName}`;

    return res.status(200).json({ 
      uploadUrl: url, 
      publicUrl: publicUrl,
      filename: uniqueFileName
    });

  } catch (error) {
    console.error("Presigned URL error:", error);
    return res.status(500).json({ error: error.message });
  }
}
