import { AppDataSource } from "../config/data-source";
import { educationDTO, uploadDegresDTO } from "../schema/educationSchema";
import { Education } from "../entities/Education";
import { EducationDegree } from "../entities/EducationDegree";
import { id } from "zod/locales";

const repo = AppDataSource.getRepository(Education);
const degreesRepo = AppDataSource.getRepository(EducationDegree);
export const educationService = {

  // create -------------------------------------------------------
  async create(dto: educationDTO) {
    const user = repo.create({
      name: dto.name,
      major: dto.major,
      gpa: dto.gpa,
      date_start: dto.date_start,
      date_end: dto.date_end,
      logo: dto.logo?.filename,
    });
    return await repo.save(user);
  },

  // find -------------------------------------------------------
  async find() {
    const education = await repo.find({
      select: {
        id: true,
        name: true,
        major: true,
        gpa: true,
        date_start: true,
        date_end: true,
        logo: true,
        created_at: true,
      },
      relations: { degree: true },
      order: { created_at: "DESC" },
    });
    if (!education) {
      throw new Error("education not Found...");
    }
    return education;
  },

  // find one -------------------------------------------------------
  async findOne(id: number) {
    const education = await repo.findOne({
      select: {
        id: true,
        name: true,
        major: true,
        gpa: true,
        date_start: true,
        date_end: true,
        logo: true,
        created_at: true,
      },
      relations: { degree: true },
      where: { id: id },
    });
    if (!education) {
      throw new Error("Profile not found...!");
    }
    return education;
  },

  // update one -------------------------------------------------------
  async updateOne(id: number, dto: educationDTO) {
    const education = await repo.update(
      { id: id },
      {
        name: dto.name,
        major: dto.major,
        gpa: dto.gpa,
        date_start: dto.date_start,
        date_end: dto.date_end,
        logo: dto.logo?.filename,
      },
    );
    if (education.affected === 0) {
      throw new Error("User not found...!");
    }
    const result = await repo.findOne({
      select: {
        id: true,
        name: true,
        major: true,
        gpa: true,
        date_start: true,
        date_end: true,
        logo: true,
        created_at: true,
      },
      where: { id: id },
    });
    return result;
  },

  // delete one -------------------------------------------------------
  async deleteOne(id: number) {
    const result = await repo.findOne({
      select: {
        id: true,
        name: true,
        major: true,
        gpa: true,
        date_start: true,
        date_end: true,
        logo: true,
        created_at: true,
      },
      where: { id: id },
    });
    await repo.delete(id)
    return result
  },

  // uploads degrees ----------------------------------------------------------
  async uploadDegres(dto: uploadDegresDTO) {
    const degrees = dto.images.map((file) =>
      degreesRepo.create({
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        encoding: file.encoding,
        by_education: {
          id: dto.by_education,
        },
      }),
    );
    await degreesRepo.save(degrees);
    return degrees;
  },

  // delete degrees -----------------------------------------------------------
  async deleteDegrees(id: number) {
    const degrees = await degreesRepo.findOne({
      select: {
        id: true,
        originalname: true,
        filename: true,
        path: true,
        size: true,
        encoding: true,
        by_education: true,
        created_at: true,
      },
      where: { id: id },
    });
    if (!degrees) {
      throw new Error("User not found...!");
    }
    await degreesRepo.delete(id);
    return degrees;
  },
};
