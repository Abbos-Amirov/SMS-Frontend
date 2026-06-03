// Read an image File, downscale it to a square thumbnail, and return a compressed
// JPEG data URL. Keeping avatars small (256px) means they fit comfortably inside
// the member document and the JSON request body without a separate file store.
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024; // reject huge source files early
const TARGET_SIZE = 256;
const JPEG_QUALITY = 0.82;

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Faqat rasm fayllarini yuklash mumkin.');
  }
  if (file.size > MAX_AVATAR_BYTES) {
    throw new Error('Rasm hajmi 4 MB dan oshmasligi kerak.');
  }

  const bitmap = await loadImage(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = TARGET_SIZE;
  canvas.height = TARGET_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Rasmni qayta ishlab boʻlmadi.');

  // Center-crop to a square, then scale down into the target box.
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, TARGET_SIZE, TARGET_SIZE);
  if ('close' in bitmap) (bitmap as ImageBitmap).close();

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }
  // Fallback for older browsers without createImageBitmap.
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Rasmni yuklab boʻlmadi.'));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
