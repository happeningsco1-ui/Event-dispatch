import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check WhatsApp Environment Variables
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return res.status(500).json({ error: "WhatsApp credentials missing in environment variables." });
  }

  // Check R2 Environment Variables (needed to host the PDF)
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    return res.status(500).json({ error: "Cloudflare R2 credentials missing in environment variables." });
  }

  const form = formidable({ multiples: false });

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const phoneNumber = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;

    if (!file || !phoneNumber) {
      return res.status(400).json({ error: "File and phone number are required." });
    }

    // 1. Upload PDF to R2
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    const fileName = `whatsapp-temp-${Date.now()}.pdf`;
    const fileStream = fs.createReadStream(file.filepath);

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: `temp-pdf/${fileName}`,
      Body: fileStream,
      ContentType: "application/pdf",
    }));

    const pdfUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/temp-pdf/${fileName}`;

    const filenameStr = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;
    const finalPhone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;

    // 2. Send via WhatsApp Cloud API
    const whatsappResponse = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: String(finalPhone || ""),
        type: "document",
        document: {
          link: pdfUrl,
          filename: String(filenameStr || "Invoice.pdf")
        }
      }),
    });

    const result = await whatsappResponse.json();

    if (result.error) {
      console.error("WhatsApp API error:", result.error);
      return res.status(500).json({ error: "Failed to send WhatsApp message", details: result.error });
    }

    return res.status(200).json({ success: true, message: "PDF sent successfully", data: result });

  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: error.message });
  }
}
