import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from '../common';

@Injectable()
export class ProductsService {

  constructor(
    private prisma: PrismaService
  ) { }

  async create(createProductDto: CreateProductDto) {

    const product = await this.prisma.product.create({
      data: createProductDto
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {

    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;

    const totalPages = await this.prisma.product.count({ where: { available: true } });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.product.findMany({
        where: {
          available: true
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage
      }
    }

  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst(
      {
        where: { id, available: true }
      });

    if (!product) throw new RpcException({
      message: `Product with id ${id} not found`,
      status: HttpStatus.BAD_REQUEST
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;
    await this.findOne(id); // Reutilizar el metodo de retornar un producto

    return this.prisma.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {

    console.log(id)

    await this.findOne(id);


    // return this.product.delete({
    //   where: { id }
    // });

    // Es mejor trabakarlo con el SoftDelete en la tabla products
    const product = await this.prisma.product.update({
      where: { id },
      data: { available: false }
    });

    return product;

  }
}
