import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailEntity } from './entities/order-detail.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ApiAllResponse, ApiOneResponse } from 'src/common/interfaces/api-response.interface';
import { ManagerError } from 'src/common/errors/manager.error';

@Injectable()
export class OrderDetailService {
  constructor(
        @InjectRepository(OrderDetailEntity)
        private readonly OrderDetailRepository: Repository<OrderDetailEntity>
      ){}
      async create(createOrderDetailDto: CreateOrderDetailDto): Promise<ApiOneResponse<OrderDetailEntity>> {
        try {
          const method = await this.OrderDetailRepository.save( createOrderDetailDto );
          if( !method ){
            throw new ManagerError({
              type: "CONFLICT",
              message: "Order detail not created!",
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
    
      async findAll( paginationDto: PaginationDto ): Promise<ApiAllResponse<OrderDetailEntity>> {
        const { limit, page } = paginationDto;
        const skip = ( page - 1 ) * limit;
    
        try {
          
          const [ total, data ] = await Promise.all([
            this.OrderDetailRepository.count({where: {isActive:true}}),
            this.OrderDetailRepository.createQueryBuilder("order")
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
    
      async findOne(id: string): Promise<ApiOneResponse<OrderDetailEntity>> {
        try {
          const method = await this.OrderDetailRepository.findOne( { where: {id, isActive: true} } );
          if( !method ){
            throw new ManagerError({
              type: "NOT_FOUND",
              message: "Order detail not found!",
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
    
      async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto): Promise<ApiOneResponse<UpdateResult>> {
        try {
          const method = await this.OrderDetailRepository.update( {id, isActive: true}, updateOrderDetailDto );
          if( method.affected === 0 ){
            throw new ManagerError({
              type: "NOT_FOUND",
              message: "Order detail not found!",
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
          const method = await this.OrderDetailRepository.update( {id, isActive: true}, {isActive: false} );
          if( method.affected === 0 ){
            throw new ManagerError({
              type: "NOT_FOUND",
              message: "order detail not found!",
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