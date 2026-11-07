import type { SupabaseClient } from "@supabase/supabase-js";

const OK = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif"];
const MAX = 5 * 1024 * 1024;

/**
 * Resizes and re-encodes raster images to WebP in the browser before upload, so a 1.9 MB phone/export original never reaches the site
 * (large originals hurt page speed and Core Web Vitals). SVG and GIF are left untouched. Falls back to the original on any failure.
 */
async function shrink(file: File, folder: string): Promise<File> {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) || typeof createImageBitmap === "undefined") return file;
  try {
    const maxSide = folder === "brand" || folder === "logos" ? 512 : folder === "team" || folder === "authors" || folder === "testimonials" ? 1200 : 1920;
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h); bmp.close?.();
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch { return file; }
}

/** Uploads to the public `media` bucket (storage policies allow staff only) and records it in media_assets. */
export async function uploadImage(db: SupabaseClient, original: File, folder: string): Promise<string> {
  if (!OK.includes(original.type)) throw new Error("Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF or SVG.");
  if (original.size > MAX * 2) throw new Error("Image is larger than 10 MB. Please reduce it and try again.");
  const file = await shrink(original, folder);
  if (file.size > MAX) throw new Error("Image is still larger than 5 MB after optimisation. Please use a smaller image.");
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = db.storage.from("media").getPublicUrl(path);
  const { data: u } = await db.auth.getUser();
  await db.from("media_assets").insert({ bucket: "media", path, url: data.publicUrl, uploaded_by: u.user?.id });
  return data.publicUrl;
}
