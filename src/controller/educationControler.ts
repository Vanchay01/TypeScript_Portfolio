import { Request, Response } from "express";
import { educationSchema, uploadDegresSchema } from "../schema/educationSchema";
import { educationService } from "../service/eductionService";

// addEducation -------------------------------------------------------------------------
export const addEducation = async (req: Request, res: Response) => {
  const education = educationSchema.safeParse({ ...req.body, logo: req.file });
  console.log(education)
  if (!education.success) {
    return res.json({
      message: education.error.issues,
      status: false,
    });
  }
  try {
    const result = await educationService.create(education.data)
    return res.json({
        message: "OK....",
        status: true,
        data: result
    })
  } catch (err: any) {
    console.error(err.message)
    return res.status(500).json({
        message: "Internal server error",
        status: false,
        error: err.message
    })
  }
};

// getAllEducation -------------------------------------------------------------------------
export const getAllEducation= async (req: Request, res: Response) => {
  try {
    const profile = await educationService.find()
    return res.json({
      message: "Gel all profile successfully...",
      status: true,
      data:  profile
    })
  } catch (err: any) {
    console.error(err.messagge)
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    })
  }
}

// getEducationById -------------------------------------------------------------------------
export const getEducationById = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try{
    const profile = await educationService.findOne(id)
    return res.json({
      message: "Get all education successfully...",
      status: true,
      data:  profile
    })
  }catch (err: any){
    console.error(err.message)
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    })
  }
}

// updateEducation -------------------------------------------------------------------------
export const updateEducation = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const reqProfile = educationSchema.safeParse({...req.body, logo: req.file})
  if(!reqProfile.success){
    return res.json({
      message: reqProfile.error.issues,
      status: false
    })
  }
  try {
    const profile = await educationService.updateOne(id, reqProfile.data);
    return res.json({
      message: "updated education successfully...",
      status: true,
      data:  profile
    })
  } catch (err: any) {
    console.error(err.message)
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    })
  }
}

// deteleEducation -------------------------------------------------------------------------
export const deteleEducation = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    const education = await educationService.deleteOne(id)
    return res.json({
      message: "delete education successfully...",
      status: true,
      data:  education
    })
  } catch (err: any) {
    console.error(err.message)
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    })
  }
}

// educationUpload -------------------------------------------------------------------------
export const educationUpload = async (req: Request, res: Response) => {
  const reqUploads = uploadDegresSchema.safeParse({...req.body, images: req.files})
  if (!reqUploads.success) {
    return res.json({
      msg: "asdasdasd",
      message: reqUploads.error.issues,
      status: false,
    });
  }
  try {
    const degrees = await educationService.uploadDegres(reqUploads.data)
    return res.json({
        message: "OK.....educationUpload",
        status: true,
        data: degrees
    })
  } catch (err: any) {
    console.error(err.message)
    return res.status(200).json({
      message: "Internal Server Error",
      error: err.message
    })
  }
} 

// educationDeleteUploads -------------------------------------------------------------------------
export const educationDeleteUploads = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    const result = await educationService.deleteDegrees(id)
    return res.json({
        message: "Deleted.....educationUpload",
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