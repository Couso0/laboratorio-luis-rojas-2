import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}
    @Post()
      create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
        return this.orderDetailService.create(createOrderDetailDto);
      }
    
      @Get()
      findAll( @Query() paginationDto: PaginationDto ) {
        return this.orderDetailService.findAll(paginationDto);
      }
    
      @Get(':id')
      findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderDetailService.findOne(id);
      }
    
      @Patch(':id')
      update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDetailDto: UpdateOrderDetailDto) {
        return this.orderDetailService.update(id, updateOrderDetailDto);
      }
    
      @Delete(':id')
      remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderDetailService.remove(id);
      }
    }
