import { features } from "node:process";
import { AppDataSource } from "../config/data-source";
import { Work } from "../entities/Work";
import { WorkImage } from "../entities/WorkImage";
import { createImageDTO, createWorkDTO, updateWorkDTO, UpdateWorkFiles, uploadWorkPicDTO, workDTO } from "../schema/workSchema";
import { dot } from "node:test/reporters";
import {ILike} from "typeorm";
import { KeyFeature } from "../entities/KeyFeature";
import { Technology } from "../entities/Technology";
import { TechnologyTool } from "../entities/TechnologyTool";
import { file } from "zod";

const repo = AppDataSource.getRepository(Work);
const workPicRepo = AppDataSource.getRepository(WorkImage);
export const workService = {
  // create work with Relationship ------------------------------------------------------------
  async createWorkRelational(dto: createWorkDTO, files: createImageDTO) {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. create Work
      const work = queryRunner.manager.create(Work, {
        name: dto.name,
        position: dto.position,
        github: dto.github,
        demo: dto.demo,
        framework: dto.framework,
        description: dto.description,
      });
      const savedWork = await queryRunner.manager.save(Work, work);

      // 2. create feature
      if(dto.features && dto.features.length > 0){ 
        const features = dto.features.map((feature) => {
          return queryRunner.manager.create(KeyFeature, {
            name: feature.name,
            description: feature.description,
            by_work: { id: savedWork.id },
          })
        })
        await queryRunner.manager.save(KeyFeature, features);
      }

      // 3. create technology
      if (dto.technologies && dto.technologies.length > 0) {
        for (const technologyDTO of dto.technologies) {
          const technology = queryRunner.manager.create(Technology,
            {
              name: technologyDTO.name,
              by_work: {id: savedWork.id},
            }
          );
          const savedTechnology = await queryRunner.manager.save(Technology, technology);

          if (technologyDTO.tools &&technologyDTO.tools.length > 0) {
            const tools = technologyDTO.tools.map((tool) => {
              return queryRunner.manager.create(TechnologyTool, {
                name: tool.name,
                by_technology: {id: savedTechnology.id}
              });
            });
            await queryRunner.manager.save(TechnologyTool, tools);
          }
        }
      }
      // 3. create iamge
      if(files.images.length > 0){
        const iamges = files.images.map((file) => {
          return queryRunner.manager.create(WorkImage, {
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            encoding: file.encoding,
            by_work: {
              id: savedWork.id,
            },
          })
        })
        await queryRunner.manager.save(WorkImage, iamges);
      }
      await queryRunner.commitTransaction();
      return savedWork
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      console.error("createWorkRelational error:", err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  },

  // edit relational work -----------------------------------------------
  async updateWorkRelational(id: number, dto: updateWorkDTO, files: UpdateWorkFiles) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const work = await queryRunner.manager.findOne(Work, {
        where: {id: id}
      })
      if (!work) {
        throw new Error("WORK_NOT_FOUND");
      }
      const {technologies, features, ...workData} = dto;

      queryRunner.manager.merge(Work, work, workData);
      const savedWork = await queryRunner.manager.save(Work,work);
      if (features !== undefined) {
        await queryRunner.manager.delete(KeyFeature, {
          by_work: {id: id}
        });
        if (features.length > 0) {
          const featureEntities = features.map((feature) =>
            queryRunner.manager.create(KeyFeature, {
              name: feature.name,
              description: feature.description,
              by_work: {
                id: id,
              },
            })
          );
          await queryRunner.manager.save(KeyFeature, featureEntities);
        }
      }
      if (technologies !== undefined) {
        const existingTechnologies = await queryRunner.manager.find(Technology, {
            where: {by_work: {id: id},},
          });
        const technology_id = existingTechnologies.map((technology) => technology.id);
        console.log(technology_id, ":id")
        if (technology_id.length > 0) {
          await queryRunner.manager
            .createQueryBuilder()
            .delete() 
            .from(TechnologyTool)
            .where("by_technology IN (:...ids)", {
              ids: technology_id,
            }).execute();
        }
        console.log("next.")
        await queryRunner.manager.delete(Technology, {
          by_work: {id: id}
        });
        for (const technologyDTO of technologies) {
          const technology = queryRunner.manager.create(Technology, {
            name: technologyDTO.name,
            by_work: {id: id}
          });
          const savedTechnology = await queryRunner.manager.save(Technology,technology);
          if(technologyDTO.tools &&technologyDTO.tools.length > 0){
            const tools = technologyDTO.tools.map((tool) => queryRunner.manager.create(TechnologyTool,{
                name: tool.name,
                by_technology: {id: savedTechnology.id,}
              })
            );
            await queryRunner.manager.save(
              TechnologyTool,
              tools
            );
          }
        }
      }
      if (files.images && files.images.length > 0) {
        const imageEntities =
          files.images.map((file) =>
            queryRunner.manager.create(
              WorkImage,
              {
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
                size: file.size,
                encoding: file.encoding,
                by_work: {
                  id: savedWork.id,
                },
              }
            )
          );

        await queryRunner.manager.save(WorkImage, imageEntities);
      }
      await queryRunner.commitTransaction();
      return savedWork;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error("updateWorkRelational error:", err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  },

  //  Create ------------------------------------------------------------
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
  // get work ------------------------------------------------------------
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
  // get user id ------------------------------------------------------------
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
  // delete work ------------------------------------------------------------
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
