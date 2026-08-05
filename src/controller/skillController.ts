import { Request, Response } from "express";
import { skillSchema } from "../schema/skillSchema";
import { skillService } from "../service/skillService";


// add skill ----------------------------------------------------------------
export const addSkill = async (req: Request, res: Response) => {
  const reqSkill = skillSchema.safeParse(req.body);
  if (!reqSkill.success) {
    return res.json({
      message: reqSkill.error.issues,
      status: false,
    });
  }
  try {
    const skill = await skillService.create(reqSkill.data);
    console.log(skill)
    return res.json({
      message: "add skill succesfully.",
      status: true,
      data: skill,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// get skill ----------------------------------------------------------------
export const getSkill = async (req: Request, res: Response) => {
  try {
    const skill = await skillService.find();
    return res.json({
      message: "Get all skill succesfully.",
      status: true,
      data: skill,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// get one skill ----------------------------------------------------------------
export const getOneSkill = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try{
    const skill = await skillService.findOne(id)
    return res.json({
      message: "Get all education successfully...",
      status: true,
      data:  skill
    })
  }catch (err: any){
    console.error(err.message)
    return res.status(500).json({
      messgae: "Internal server error",
      error: err.message,
    })
  }
}

// update skill ----------------------------------------------------------------
export const updateSkill = async (req: Request, res: Response) => {
  console.log("Controller updateSkill is OK1")
  const id = Number(req.params.id);
  const reqSkill = skillSchema.safeParse(req.body);
  console.log("Controller updateSkill is OK2", id, reqSkill.data)
  if (!reqSkill.success) {
    return res.json({
      message: reqSkill.error.issues,
      status: false,
    });
  }
  
  try {
    const skill = await skillService.updateOne(id, reqSkill.data);
    console.log(reqSkill.data)
    return res.json({
      message: "Updated skill succesfully.",
      status: true,
      data: skill,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// delete one skill ----------------------------------------------------------------
export const deleteSkill = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const skill = await skillService.deleteOne(id);
    return res.json({
      message: "deleted skill succesfully.",
      status: true,
      data: skill,
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
