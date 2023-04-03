import { Controller, Delete, Get, Post, Patch } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';

@Controller('/events')
export class EventsController {
  @Get()
  findAll(@Param('id') id) {
    return id;
  }

  @Get(':id')
  findOne() {}

  @Post()
  create() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
