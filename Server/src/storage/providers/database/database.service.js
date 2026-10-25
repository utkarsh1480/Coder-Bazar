import { randomUUID } from "node:crypto";
import prisma from "../../../lib/prisma.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const IMAGE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function saveImage(ownerId, contentType, data) {
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    const error = new Error("Only JPG, PNG, and WEBP images are supported");
    error.statusCode = 400;
    throw error;
  }

  if (!Buffer.isBuffer(data) || data.length === 0 || data.length > MAX_FILE_SIZE) {
    const error = new Error("Images must be no larger than 5 MB");
    error.statusCode = 400;
    throw error;
  }

  const image = await prisma.storedImage.create({
    data: {
      id: randomUUID(),
      ownerId,
      contentType,
      data,
    },
    select: {
      id: true,
    },
  });

  return image.id;
}

export async function getImage(imageId) {
  if (!IMAGE_ID_PATTERN.test(imageId)) {
    const error = new Error("Image not found");
    error.statusCode = 404;
    throw error;
  }

  const image = await prisma.storedImage.findUnique({
    where: { id: imageId },
    select: {
      contentType: true,
      data: true,
    },
  });

  if (!image) {
    const error = new Error("Image not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    contentType: image.contentType,
    data: Buffer.from(image.data),
  };
}

export async function getListingImageUrls(ownerId, imageIds = []) {
  if (imageIds.length === 0) {
    return [];
  }

  if (imageIds.some((id) => !IMAGE_ID_PATTERN.test(id))) {
    const error = new Error("Invalid listing image key");
    error.statusCode = 400;
    throw error;
  }

  const images = await prisma.storedImage.findMany({
    where: {
      id: { in: imageIds },
      ownerId,
    },
    select: {
      id: true,
    },
  });
  const ownedImageIds = new Set(images.map(({ id }) => id));

  if (imageIds.some((id) => !ownedImageIds.has(id))) {
    const error = new Error("Invalid listing image key");
    error.statusCode = 400;
    throw error;
  }

  return imageIds.map((id) => `/api/storage/images/${id}`);
}
