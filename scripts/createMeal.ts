import { promises as fs } from "fs";
import path from "path";
import { loadEnvFile } from "process";

loadEnvFile();

const API_URL = `https://${process.env.API_GATEWAY_CUSTOM_DOMAIN}/meals`;
const TOKEN =
  "eyJraWQiOiJwODdBODBlTkloUFJYRlk4a21IdW1oRGI2WmpPajI3NWFlOGRTNHJUQmxJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlNGQ4MjRlOC05MGIxLTcwNmItZDc5NC03NGE2ZTViMGVmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9VUTlNQW9jTHQiLCJjbGllbnRfaWQiOiI0ZjVkcGJxdGczbW5uYXFoajV0OThvNjVxMCIsIm9yaWdpbl9qdGkiOiI1ODM2MzY5My1iOTk4LTQ0OTktODFjMi0yOGVmYTVjMDVkNWYiLCJpbnRlcm5hbElkIjoiMzBxbVJrc3ZLYkNiZGpiU0NncVdzQ0dERnBRIiwiZXZlbnRfaWQiOiI5ZDdjNTIyNy0zNTZjLTQ0YzYtOWM3MC1kYzJlYjI2ZTE1ODciLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU1MjA2NDMwLCJleHAiOjE3NTUyNDk2MjksImlhdCI6MTc1NTIwNjQzMCwianRpIjoiOGM2NWNmZWMtMDc5ZS00MDM5LTk3NjQtYmRkYWZiNmNlY2IyIiwidXNlcm5hbWUiOiJlNGQ4MjRlOC05MGIxLTcwNmItZDc5NC03NGE2ZTViMGVmMDUifQ.40YtAeRXfFH_VUFnOeBodutn6aO4rgawmM2iMxRiV1JM1mvajOR41cqBHxenxhByIWtUxMVG32nDESykdLtt4eos-KGGn0EoHcKeyX1yadGktvTRE6PvBVDe_p6LjkAnyDCzjkhulaKcrPqFn7MqkDiYpKviO3S-R_KP8bOs6x8j2qMIYW5ZQeLk-LSvsm7_QiihVjLDcGN77V4iJFa85CupHHq3kStFNIx9bXRzfV5HlwGDRxMOz2xkt1U2Ao3dc82HWax9O3t2h70Ne7J_DU6DDH2KUgaWJ6-VBj48AcPNq7qGuS9lgUEJkV3wJL6Wozr0EHD3ky1nd1EyZgwdYw";

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readImageFile(filePath: string): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type: "image/jpeg",
  };
}

async function createMeal(
  fileType: string,
  fileSize: number
): Promise<IPresignDecoded> {
  console.log(
    `🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`
  );
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get presigned POST: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, "base64").toString("utf-8")
  ) as IPresignDecoded;

  console.log("✅ Received presigned POST data");
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string
): FormData {
  console.log(
    `📦 Building FormData with ${
      Object.keys(fields).length
    } fields and file ${filename}`
  );
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([fileData as any], { type: fileType });
  form.append("file", blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `S3 upload failed: ${res.status} ${res.statusText} — ${text}`
    );
  }

  console.log("🎉 Upload completed successfully");
}

async function uploadMealImage(filePath: string): Promise<void> {
  try {
    const { data, size, type } = await readImageFile(filePath);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error("❌ Error during uploadMealImage:", err);
    throw err;
  }
}

uploadMealImage(path.resolve(__dirname, "assets", "meal.jpg")).catch(() =>
  process.exit(1)
);
