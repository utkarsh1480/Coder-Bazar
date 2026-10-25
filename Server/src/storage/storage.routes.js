import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createImageUpload, getImageById } from "./storage.controller.js";

const storageRouter = express.Router();

storageRouter.get("/images/:imageId", getImageById);
storageRouter.post(
  "/upload",
  requireAuth,
  express.raw({ type: "*/*", limit: "5mb" }),
  createImageUpload
);

export default storageRouter;
