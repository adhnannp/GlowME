export default function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split('/');
    const fileNameIndex = parts.findIndex((part) => part === 'profile_images') + 1;
    if (fileNameIndex === 0 || fileNameIndex >= parts.length) {
      return null;
    }
    const fileName = parts[fileNameIndex];
    const publicId = `profile_images/${fileName.split('.')[0]}`;
    return publicId;
  } catch (error) {
    console.warn(`Invalid Cloudinary URL: ${url}`);
    return null;
  }
}