import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    description: 'Product ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    required: true,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
  
  @ApiProperty({
    description: 'Add gift wrap',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  giftWrap?: boolean;

  @ApiProperty({
    description: 'Add express shipping',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  expressShipping?: boolean;
}
