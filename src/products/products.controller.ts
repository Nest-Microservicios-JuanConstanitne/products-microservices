import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //@Post()
  @MessagePattern({ cmd: 'create_product' })
  //create(@Body() createProductDto: CreateProductDto) {
  create(
    @Payload() createProductDto: CreateProductDto
  ) {
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'find_all_products' })
  //findAll(@Query() paginationDto: PaginationDto) {
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  //findOne(@Param('id') id: string) {
  findOne(
    @Payload('id', ParseIntPipe) id: number
  ) {
    return this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  //update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  update(
    @Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  //remove(@Param('id', ParseIntPipe) id: number) {
  remove(
    @Payload('id', ParseIntPipe) id: number
  ) {
    return this.productsService.remove(id);
  }
}
