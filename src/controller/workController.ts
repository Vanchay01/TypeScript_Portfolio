import { Request, Response } from "express";
import { workService } from "../service/workService";
import { createWorkSchema, uploadWorkPicSchema, workSchema } from "../schema/workSchema";


// add with relationalship ------------------------------------------------------------
export const addRelationalWork = async (req: Request, res: Response) => {
  const reqWork = createWorkSchema.safeParse(req.body)
  if(!reqWork.success){
    return res.json({
      message: reqWork.error.issues,
      status: false
    })
  }
  try {
    const result = await workService.createWorkRelational(reqWork.data);
    return res.json({
      message: "Find all work successfully.",
      status: true,
      data: result,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

// add ------------------------------------------------------------
export const addWork = async (req: Request, res: Response) => {
    const reqWork = workSchema.safeParse(req.body)
    if(!reqWork.success){
      return res.json({
        message: reqWork.error.issues,
        status: false
      })
    }
    try {
      const result = await workService.creat(reqWork.data);
      return res.json({
        message: "Find all work successfully.",
        status: true,
        data: result,
      });
    } catch (err: any) {
      console.error(err.message);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
};

// get all ------------------------------------------------------------
export const getAllWork = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const search = String(req.query.search || "").trim()
    try {
      const result = await workService.find(page, limit, search);
      return res.json({
        message: "Find all work successfully.",
        status: true,
        data: result,
      });
    } catch (err: any) {
      console.error(err.message);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }
};

// getAllById ------------------------------------------------------------
export const getWorkById = async (req: Request, res: Response) => {
  console.log('asdasd - workController.ts:50')
  const id = Number(req.params.id);
  try {
    const result = await workService.findOne(id);
    return res.json({
      message: `Get Work: ${result.name} successfully`,
      status: true,
      data: result,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// deleteUser ------------------------------------------------------------
export const deleteWork = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const result = await workService.deleteOne(id);
    if (!result) {
      return res.json({
        message: "Something was wrong!!!",
        status: false,
      });
    }
    return res.json({
      message: "Deleted Work successfully.",
      status: true,
      data: result,
    });
  } catch (err: any) {
    console.error(err.messgae);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// updateWork ------------------------------------------------------------
export const updateWork = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const work = workSchema.safeParse(req.body);
  if (!work.success) {
    return res.json({
      message: work.error.issues,
      status: false,
    });
  }
  try {
    const result = await workService.updateOne(id, work.data);
    return res.json({
      message: "Updated user successfully.",
      status: 200,
      data: result,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};

// workUpload ------------------------------------------------------------
export const workUpload = async (req: Request, res: Response) => {
  console.log("asdasd  educationControler.ts:88 - workController.ts:118")
  const reqUploads = uploadWorkPicSchema.safeParse({...req.body, images: req.files})
  
  if (!reqUploads.success) {
    return res.json({
      message: reqUploads.error.issues,
      status: false,
    });
  }
  try {
    const picture = await workService.uploadPic(reqUploads.data)
    return res.json({
        message: "OK.....picture of work",
        status: true,
        data: picture
    })
  } catch (err: any) {
    console.error(err.message)
    return res.status(200).json({
      message: "Internal Server Error",
      error: err.message
    })
  }
} 

// workDeletePic ------------------------------------------------------------
export const workDeletePic = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    const result = await workService.deleteUploadPic(id)
    return res.json({
        message: "Deleted.....picture of work",
        status: true,
        data: result
    })
  } catch (err: any) {  
    console.error(err.message)
    return res.status(200).json({
      message: "Internal Server Error",
      error: err.message
    })
  }
} 