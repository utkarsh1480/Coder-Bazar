import { getImage, saveImage } from "./storage.service.js";

export async function createImageUpload(req, res, next) {
  try {
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An image file is required",
      });
    }

    const imageId = await saveImage(
      req.user.sub,
      req.get("Content-Type"),
      req.body
    );

    res.status(201).json({
      success: true,
      data: {
        key: imageId,
        url: `/api/storage/images/${imageId}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getImageById(req, res, next) {
  try {
    const image = await getImage(req.params.imageId);

    res
      .set("Content-Type", image.contentType)
      .set("Cross-Origin-Resource-Policy", "cross-origin")
      .set("Cache-Control", "public, max-age=86400, immutable")
      .send(image.data);
  } catch (error) {
    next(error);
  }
}
