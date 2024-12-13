import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShipperDto } from './dto/create-shipper.dto';
import { UpdateShipperDto } from './dto/update-shipper.dto';
import { PaginationDto } from 'src/common/dtos/pagination/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShipperEntity } from './entities/shipper.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ApiAllResponse, ApiOneResponse } from 'src/common/interfaces/api-response.interface';
import { ManagerError } from 'src/common/errors/manager.error';

@Injectable()
export class ShipperService {
 constructor(
     @InjectRepository(ShipperEntity)
     private readonly shipperRepository: Repository<ShipperEntity>
   ){}
   async create(createShipperDto: CreateShipperDto): Promise<ApiOneResponse<ShipperEntity>> {
     try {
       const employee = await this.shipperRepository.save( createShipperDto );
       if( !employee ){
         throw new ManagerError({
           type: "CONFLICT",
           message: "shipper not created!",
         })
       }
 
       return {
         status: {
           statusMsg: "CREATED",
           statusCode: HttpStatus.CREATED,
           error: null,
         },
         data: employee,
       }
     } catch (error) {
       ManagerError.createSignatureError(error.message);
     }
   }
 
   async findAll( paginationDto: PaginationDto ): Promise<ApiAllResponse<ShipperEntity>> {
     const { limit, page } = paginationDto;
     const skip = ( page - 1 ) * limit;
 
     try {
       
       const [ total, data ] = await Promise.all([
         this.shipperRepository.count({where: {isActive:true}}),
         this.shipperRepository.createQueryBuilder("employee")
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
 
   async findOne(id: string): Promise<ApiOneResponse<ShipperEntity>> {
     try {
       const employee = await this.shipperRepository.findOne( { where: {id, isActive: true} } );
       if( !employee ){
         throw new ManagerError({
           type: "NOT_FOUND",
           message: "shipper not found!",
         })
       }
 
       return {
         status: {
           statusMsg: "OK",
           statusCode: HttpStatus.OK,
           error: null,
         },
         data: employee,
       }
     } catch (error) {
       ManagerError.createSignatureError(error.message);
     }
   }
 
   async update(id: string, updateShipperDto: UpdateShipperDto): Promise<ApiOneResponse<UpdateResult>> {
     try {
       const shipper = await this.shipperRepository.update( {id, isActive: true}, updateShipperDto );
       if( shipper.affected === 0 ){
         throw new ManagerError({
           type: "NOT_FOUND",
           message: "shipper not found!",
         })
       }
 
       return {
         status: {
           statusMsg: "OK",
           statusCode: HttpStatus.OK,
           error: null,
         },
         data: shipper,
       }
     } catch (error) {
       ManagerError.createSignatureError(error.message);
     }
   }
 
   async remove(id: string): Promise<ApiOneResponse<UpdateResult>> {
     try {
       const employee = await this.shipperRepository.update( {id, isActive: true}, {isActive: false} );
       if( employee.affected === 0 ){
         throw new ManagerError({
           type: "NOT_FOUND",
           message: "shipper not found!",
         })
       }
 
       return {
         status: {
           statusMsg: "OK",
           statusCode: HttpStatus.OK,
           error: null,
         },
         data: employee,
       }
     } catch (error) {
       ManagerError.createSignatureError(error.message);
     }
   }
 }