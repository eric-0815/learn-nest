import { Event } from './event.entity';
import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  ValidationPipe,
  Logger,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { Body, HttpCode, Param } from '@nestjs/common/decorators';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { FindOneOptions, Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) { }

  @Get()
  async findAll() {
    this.logger.log('Hit the findAll route');
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  // @Get('/practice')
  // async practice() {
  //   return await this.repository.find({
  //     select: ['id', 'when'],
  //     where: [
  //       {
  //         id: MoreThan(3), //{ id: 3 },
  //         when: MoreThan(new Date('2020-12-12T13:00:00')),
  //       },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //     take: 2, //limit the number of result,
  //     order: {
  //       id: 'ASC',
  //     },
  //   });
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Hit the findOne route for id: ${id}`);

    const options: FindOneOptions = {
      where: {
        id: id,
      },
    };
    const event = await this.repository.findOne(options);

    if (!event) throw new NotFoundException();

    return event;
  }

  @Post()
  async create(@Body(ValidationPipe) input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);

    if (!event) throw new NotFoundException();

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOne(id);

    if (!event) throw new NotFoundException();

    await this.repository.remove(event);
  }
}
