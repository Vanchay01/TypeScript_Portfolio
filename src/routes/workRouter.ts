
import { Router } from "express";
import { addWork, deleteWork, getAllWork, getWorkById, updateWork, workDeletePic, workUpload, addRelationalWork } from "../controller/workController";
import upload from "../middleware/upload";
export const workRouter = Router();

workRouter.post("/uploads", upload.array('images', 4), workUpload);
workRouter.delete("/remove_upload/:id", workDeletePic);
workRouter.post("/add_all", upload.array('images', 4), addRelationalWork)
workRouter.post("/", addWork)
workRouter.get("/", getAllWork)
workRouter.get("/:id", getWorkById);
workRouter.delete("/:id", deleteWork);
workRouter.patch("/:id", updateWork); 