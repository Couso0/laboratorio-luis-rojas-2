import { BaseEntity } from "./../../common/config/base.entity";
import { CustomerEntity } from "./../../customers/entities/customer.entity";
import { EmployeeEntity } from "./../../employee/entities/employee.entity";
import { OrderDetailEntity } from "./../../order-detail/entities/order-detail.entity";
import { ShipperEntity } from "./../../shipper/entities/shipper.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
@Entity({name:"order"})
export class OrderEntity extends BaseEntity {

@Column({type: "date"})
orderDate:number;

@ManyToOne(()=>CustomerEntity, (customer)=>customer.order)
@JoinColumn({name: "customer_id"})
customer:string;

@ManyToOne(()=>EmployeeEntity, (employee)=>employee.order)
@JoinColumn({name: "employee_id"})
employee:string;

@ManyToOne(()=>ShipperEntity, (shipper)=>shipper.order)
@JoinColumn({name: "shipper_id"})
shipper:string;

@OneToMany(()=>OrderDetailEntity, (orderDetail)=>orderDetail.order)
orderDetail: OrderEntity[];
}
