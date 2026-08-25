import z from "zod";

export const workSchema = z.object({
  name: z.string().min(1, "Name is required!!"),
  position: z.string(),
  github: z.string(),
  demo: z.string(),
  framework: z.string(),
  description: z.string(),
});
export const uploadWorkPicSchema = z.object({
  images: z.custom<Express.Multer.File[]>(),
  by_work: z.coerce.number(),
});
export type workDTO = z.infer<typeof workSchema>;
export type uploadWorkPicDTO = z.infer<typeof uploadWorkPicSchema>;




// create work with relational
export const createToolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
});
export const createTechnologySchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  tools: z.array(createToolSchema).default([]),
});
export const createFeatureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  description: z.string().min(1, "Feature description is required"),
});
export const createImageSchema = z.object({
  images: z.custom<Express.Multer.File[]>(),
  by_work: z.coerce.number(),
});
export const createWorkSchema = workSchema.extend({
  technologies: z.array(createTechnologySchema).default([]),
  features: z.array(createFeatureSchema).default([]),
  image: z.array(createImageSchema).default([])
});


export type createToolDTO = z.infer<typeof createToolSchema>;
export type createTechnologyDTO = z.infer<typeof createTechnologySchema>;
export type createFeatureDTO = z.infer<typeof createFeatureSchema>;
export type createWorkDTO = z.infer<typeof createWorkSchema>;
export type createImageDTO = z.infer<typeof createImageSchema>; 

// schemas/workSchema.ts
export const updateToolSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Tool name is required"),
});
export const updateTechnologySchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Technology name is required"),
  tools: z.array(updateToolSchema).default([]),
});
export const updateFeatureSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Feature name is required"),
  description: z.string().min(1, "Feature description is required"),
});
export const updateWorkSchema = workSchema.partial().extend({
  technologies: z.array(updateTechnologySchema).optional(),
  features: z.array(updateFeatureSchema).optional(),
});

export type updateWorkDTO = z.infer<typeof updateWorkSchema>;
export type UpdateWorkFiles = {
  images: Express.Multer.File[];
};