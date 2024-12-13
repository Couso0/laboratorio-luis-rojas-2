import { IsInt, IsNotEmpty } from "class-validator";

export class CreateOrderDetailDto {
    @IsInt()
    @IsNotEmpty()
    quantity: number;
}
