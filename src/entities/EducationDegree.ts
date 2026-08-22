import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Education } from "./Education";


@Entity("education_degree")
export class EducationDegree {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    originalname: string
    @Column()
    filename: string
    @Column()
    path: string
    @Column()
    size: number
    @Column()
    encoding: string

    @ManyToOne(
        () => Education,
        (education) => education.degree,
        {onDelete: "CASCADE"}
    )
    @JoinColumn({name: "by_education"})
    by_education: Education

    @CreateDateColumn()
    created_at: Date
}