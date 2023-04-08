import { Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Controller('school')
export class TrainingController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) { }

  @Post('/create')
  public async savingRelation() {
    const subject = await this.subjectRepository.findOne({
      where: { id: 3 },
      relations: ['teachers'],
    });

    const teacher1 = await this.teacherRepository.findOne({ where: { id: 5 } });
    const teacher2 = await this.teacherRepository.findOne({ where: { id: 6 } });

    subject.teachers.push(teacher1, teacher2);

    return await this.subjectRepository.save(subject);
  }

  @Post('/remove')
  public async removingRelation() {
    // const subject = await this.subjectRepository.findOne(
    //   1,
    //   { relations: ['teachers'] }
    // );

    // subject.teachers = subject.teachers.filter(
    //   teacher => teacher.id !== 2
    // );

    // await this.subjectRepository.save(subject);
    await this.subjectRepository
      .createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute();
  }
}
