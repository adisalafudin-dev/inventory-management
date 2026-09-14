import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagService } from './tag.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { TagIdsDto } from './dto/tag-ids.dto.js';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get('item/:itemId')
  getTagsForItem(@Param('itemId') itemId: string) {
    return this.tagService.getTagsForItem(itemId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Get(':id/items')
  getItemsForTag(@Param('id') id: string) {
    return this.tagService.getItemsForTag(+id);
  }

  @Post('items/:itemId')
  attachToItem(@Body() dto: TagIdsDto, @Param('itemId') itemId: string) {
    return this.tagService.attachToItem(dto.idTags, itemId);
  }

  @Delete('items/:itemId')
  detachFromItem(@Body() dto: TagIdsDto, @Param('itemId') itemId: string) {
    return this.tagService.detachFromItem(dto.idTags, itemId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
