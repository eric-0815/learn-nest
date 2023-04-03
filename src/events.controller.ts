import { Controller, Delete, Get, Post, Patch } from '@nestjs/common';
import { Body, HttpCode, Param } from '@nestjs/common/decorators';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  @Get()
  findAll() {
    return [
      { id: 1, name: '1 event' },
      { id: 2, name: '2 event' },
    ];
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return { id: 1, name: '1 event' };
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return input;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {}

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {}
}
