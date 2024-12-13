import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ManagerError } from './../common/errors/manager.error';
import { Repository, UpdateResult } from 'typeorm';
import { ApiAllResponse, ApiOneResponse } from './../common/interfaces/api-response.interface';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from './../common/dtos/pagination/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
      @InjectRepository(OrderEntity)
      private readonly OrderRepository: Repository<OrderEntity>
    ){}
    async create(createOrderDto: CreateOrderDto): Promise<ApiOneResponse<OrderEntity>> {
      try {
        const method = await this.OrderRepository.save( createOrderDto );
        if( !method ){
          throw new ManagerError({
            type: "CONFLICT",
            message: "Order not created!",
          })
        }
  
        return {
          status: {
            statusMsg: "CREATED",
            statusCode: HttpStatus.CREATED,
            error: null,
          },
          data: method,
        }
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async findAll( paginationDto: PaginationDto ): Promise<ApiAllResponse<OrderEntity>> {
      const { limit, page } = paginationDto;
      const skip = ( page - 1 ) * limit;
  
      try {
        
        const [ total, data ] = await Promise.all([
          this.OrderRepository.count({where: {isActive:true}}),
          this.OrderRepository.createQueryBuilder("order")
          .where({isActive: true})
          .skip(skip)
          .limit(limit)
          .getMany(),
        ]);
        const lastPage = Math.ceil( page / limit );
        return {
          status: {
            statusMsg: "OK",
            statusCode: HttpStatus.OK,
            error: null,
          },
          meta: {
            page,
            lastPage,
            limit,
            total
          },
          data
        }
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async findOne(id: string): Promise<ApiOneResponse<OrderEntity>> {
      try {
        const method = await this.OrderRepository.findOne( { where: {id, isActive: true} } );
        if( !method ){
          throw new ManagerError({
            type: "NOT_FOUND",
            message: "Order not found!",
          })
        }
  
        return {
          status: {
            statusMsg: "OK",
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: method,
        }
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async update(id: string, updateOrderDto: UpdateOrderDto): Promise<ApiOneResponse<UpdateResult>> {
      try {
        const method = await this.OrderRepository.update( {id, isActive: true}, updateOrderDto );
        if( method.affected === 0 ){
          throw new ManagerError({
            type: "NOT_FOUND",
            message: "Order not found!",
          })
        }
  
        return {
          status: {
            statusMsg: "OK",
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: method,
        }
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
  
    async remove(id: string): Promise<ApiOneResponse<UpdateResult>> {
      try {
        const method = await this.OrderRepository.update( {id, isActive: true}, {isActive: false} );
        if( method.affected === 0 ){
          throw new ManagerError({
            type: "NOT_FOUND",
            message: "order not found!",
          })
        }
  
        return {
          status: {
            statusMsg: "OK",
            statusCode: HttpStatus.OK,
            error: null,
          },
          data: method,
        }
      } catch (error) {
        ManagerError.createSignatureError(error.message);
      }
    }
}