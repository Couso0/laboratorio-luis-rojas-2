import { BaseEntity } from "./../../common/config/base.entity";
import { OrderEntity } from "./../../order/entities/order.entity";
import { ProductEntity } from "./../../products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name:"orderDetail"})
export class OrderDetailEntity extends BaseEntity {
    
    @Column({type: "int"})
    quantity: number;
    
    @ManyToOne(()=>ProductEntity, (product)=>product.orderDetail)
    @JoinColumn({name: "product_id"})
    product:string;
    
    @ManyToOne(()=>OrderEntity, (order)=>order.orderDetail)
    @JoinColumn({name: "order_id"})
    order:string;
}
