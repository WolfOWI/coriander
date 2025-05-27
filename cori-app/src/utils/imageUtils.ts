/**
 * Utility functions for handling images
 */

/**
 * Converts a relative image path to a full URL using the base API URL
 * @param relativePath - The relative path of the image (e.g., "/uploads/image.jpg") or a full Google profile URL
 * @returns The full URL of the image or null if no path provided
 */
export const getFullImageUrl = (relativePath: string | null): string | null => {
  if (!relativePath) return null;

  // If it's already a full URL (Google profile picture), return as is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }

  // Get the base URL by removing '/api' from VITE_API_URL
  const baseUrl = process.env.VITE_API_URL?.replace("/api", "");
  return `${baseUrl}${relativePath}`;
};
