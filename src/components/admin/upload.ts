import type { SupabaseClient } from "@supabase/supabase-js";

const OK = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
const MAX = 5 * 1024 * 1024;

/** Uploads to the public `media` bucket (storage policies allow staff only) and records it in media_assets. */
export async function uploadImage(db: SupabaseClient, file: File, folder: string): Promise<string> {
  if (!OK.includes(file.type)) throw new Error("Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF or SVG.");
  if (file.size > MAX) throw new Error("Image is larger than 5 MB. Please compress it and try again.");
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = db.storage.from("media").getPublicUrl(path);
  const { data: u } = await db.auth.getUser();
  await db.from("media_assets").insert({ bucket: "media", path, url: data.publicUrl, uploaded_by: u.user?.id });
  return data.publicUrl;
}
