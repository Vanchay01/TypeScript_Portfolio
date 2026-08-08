import { features } from "node:process";
import { AppDataSource } from "../config/data-source";
import { Work } from "../entities/Work";
import { WorkImage } from "../entities/WorkImage";
import { uploadWorkPicDTO, workDTO } from "../schema/workSchema";
import { dot } from "node:test/reporters";
import {ILike} from "typeorm";

const repo = AppDataSource.getRepository(Work);
const workPicRepo = AppDataSource.getRepository(WorkImage);
export const workService = {
  //  Creatr work
  async creat(dto: workDTO) {
    const work = repo.create({
      name: dto.name,
      position: dto.position,
      github: dto.github,
      demo: dto.demo,
      framework: dto.framework,
      description: dto.description,
    });
    return await repo.save(work);
  },
  // get work
  async find(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? [
      {name: ILike(`%${search}%`)},
      {position: ILike(`%${search}%`)},
      {framework: ILike(`%${search}%`)},
    ] : undefined;
    const [work, total] = await repo.findAndCount({
      select: {
        id: true,
        name: true,
        position: true,
        github: true,
        demo: true,
        framework: true,
        description: true,
        created_at: true,
      },
      relations: {
        image: true,
        feature: true,
        technology: {
          tool: true,
        },
      },
      where,
      take: limit,
      skip: skip,
      order: { created_at: "DESC" },
    });
    if (!work) {
      throw new Error("Work not found.");
    }
    return {
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
      data: work,
    };
  },
  // get user id -------------------
  async findOne(id: number) {
    console.log("aa - workService.ts:63")
    const work = await repo.findOne({
      select: {
        id: true,
        name: true,
        position: true,
        github: true,
        demo: true,
        framework: true,
        description: true,
        created_at: true,
      },
      relations: {
        image: true,
        feature: true,
        technology: {
          tool: true,
        },
      },
      where: {id: id},
      order: { created_at: "DESC" },
    });
    if (!work) {
      throw new Error("work not found...!");
    }
    return work;
  },
  // delete work
  async deleteOne(id: number) {
    const work = await repo.findOne({
      select: {
        id: true,
        name: true,
        position: true,
        github: true,
        demo: true,
        framework: true,
        description: true,
        created_at: true,
      },
      relations: {
        image: true,
        feature: true,
        technology: {
          tool: true,
        },
      },
      where: {id: id},
      order: { created_at: "DESC" },
    });
    if (!work) {
      throw new Error("work not found...!");
    }
    await repo.delete(id);
    return work;
  },
  // update work -----------------------------------
  async updateOne(id: number, dto: workDTO) {
    const work = await repo.update(
      { id: id },
      {
        name: dto.name,
        position: dto.position,
        github: dto.github,
        demo: dto.demo,
        framework: dto.framework,
        description: dto.description,
      },
    );
    if (work.affected === 0) {
      throw new Error("work not found...!");
    }
    const result = await repo.findOne({
      select: {
        id: true,
        name: true,
        position: true,
        github: true,
        demo: true,
        framework: true,
        description: true,
        created_at: true,
      },
      relations: {
        image: true,
        feature: true,
        technology: {
          tool: true,
        },
      },
      where: {id: id},
      order: { created_at: "DESC" },
    });
    return result;
  },
  // uploads picture ----------------
  async uploadPic(dto: uploadWorkPicDTO) {
    const upload = dto.images.map((file) =>
      workPicRepo.create({
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        encoding: file.encoding,
        by_work: {
          id: dto.by_work,
        },
      }),
    );
    await workPicRepo.save(upload);
    return upload;
  },
  // delete picture ----------------------
  async deleteUploadPic(id: number) {
    const picture = await workPicRepo.findOne({
      select: {
        id: true,
        originalname: true,
        filename: true,
        path: true,
        size: true,
        encoding: true,
        by_work: true,
        created_at: true,
      },
      where: { id: id },
    });
    if (!picture) {
      throw new Error("picture not found...!");
    }
    await workPicRepo.delete(id);
    return picture;
  },
};
