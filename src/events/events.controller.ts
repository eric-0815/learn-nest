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
import { Body, HttpCode, Param, Query } from '@nestjs/common/decorators';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) { }

  @Get()
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter);
    this.logger.log(`Hit the findAll route`);
    const events = await this.eventsService.getEventsWithAttendeeCountFiltered(
      filter,
    );
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        {
          id: MoreThan(3), //{ id: 3 },
          when: MoreThan(new Date('2020-12-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2, //limit the number of result,
      order: {
        id: 'ASC',
      },
    });
  }

  @Get('/practice2')
  async practice2() {
    // const options: FindOneOptions = {
    //   where: {},
    //   relations: ['attendees'],
    // };
    // return await this.repository.findOne(options);

    // const event = await this.repository.findOne({
    //   where: { id: 1 },
    // });

    // const event = new Event();
    // event.id = 1;

    // const attendee = new Attendee();
    // attendee.name = 'Terry The Second';
    // attendee.event = event;

    // await this.attendeeRepository.save(attendee);

    // return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Hit the findOne route for id: ${id}`);

    // const options: FindOneOptions = {
    //   where: {
    //     id: id,
    //   },
    //   relations: ['attendees'],
    // };
    // const event = await this.repository.findOne(options);
    const event = await this.eventsService.getEvent(id);

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
