import { promises as fs } from "fs";
import path from "path";
import { loadEnvFile } from "process";

loadEnvFile();

const API_URL = `https://${process.env.API_GATEWAY_CUSTOM_DOMAIN}/meals`;
const TOKEN =
  "eyJraWQiOiJwODdBODBlTkloUFJYRlk4a21IdW1oRGI2WmpPajI3NWFlOGRTNHJUQmxJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlNGQ4MjRlOC05MGIxLTcwNmItZDc5NC03NGE2ZTViMGVmMDUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9VUTlNQW9jTHQiLCJjbGllbnRfaWQiOiI0ZjVkcGJxdGczbW5uYXFoajV0OThvNjVxMCIsIm9yaWdpbl9qdGkiOiJlMjY4MDdlMy1iOTM5LTQ3NDYtODNjYS1mNzdhZTJkN2YwYmYiLCJpbnRlcm5hbElkIjoiMzBxbVJrc3ZLYkNiZGpiU0NncVdzQ0dERnBRIiwiZXZlbnRfaWQiOiI3ZDZiMjI5Ni1hODQ3LTRhNDYtYjA2MS0yOTk4MTExYzI2MjYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU1NTU4Mzk4LCJleHAiOjE3NTU2MDE1OTgsImlhdCI6MTc1NTU1ODM5OCwianRpIjoiODllYzUxNWYtOTY4OC00ZTQ4LTkxOGMtM2ZhY2NlZmUzNzllIiwidXNlcm5hbWUiOiJlNGQ4MjRlOC05MGIxLTcwNmItZDc5NC03NGE2ZTViMGVmMDUifQ.y5gIdpQUpOk91AizyDgqUWZlyiqIkjozv9qyM7i2NydnWNrUhVO5z79kqlM--VZzFjpDGcWUkuw3lmLMI7pItiGnQvKwXorxH26v90U7E23hD4lBKnGG608-B9F-pjBSw8d-oD-X1j2rV0lELsmOL3TTR8XpU3Xar7KRKPHRHQul198sx0ZF3IXGIcBg6RHyHjYcvyyNj4XrT2Rl78BjPGmnNQGDIgwmdtSM7JdZqUwFQiGhTh31st_7iUf49Jvy30vDl5xHXuH5B_6FhLvsdtSwriP1rKbaPfVhe0agzwdf0IFkn41T5FBQnOfxFpykyNcgP5GhO9RSvtwVSEhteA";

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(
  filePath: string,
  type: "audio/m4a" | "image/jpeg"
): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
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

async function uploadFile(
  filePath: string,
  fileType: "audio/m4a" | "image/jpeg"
): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error("❌ Error during uploadFile:", err);
    throw err;
  }
}

uploadFile(path.resolve(__dirname, "assets", "meal.m4a"), "audio/m4a").catch(
  () => process.exit(1)
);
