import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductService')

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected')
  }


  create(createProductDto: CreateProductDto) {

  
  return this.product.create({
    data: createProductDto
  })
  }

  async findAll( paginationDto: PaginationDto ) {

    const { page, limit  } = paginationDto;

    const totalPages = await this.product.count({ where:{ available: true } });
    const lastPage = Math.ceil( totalPages / limit ); // el ceil sirve para redondar al número entero positivo que sigue en la división


    return {
      data: await this.product.findMany({
        skip: ( page - 1 ) * limit,
        take: limit,
        where: { available: true }
      }),
      meta:{
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne( id: number ) {
    const product = await this.product.findFirst({
      where: { id, available: true }
    });

    if ( !product )
        throw new NotFoundException(`Product with id #${ id } not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    await this.findOne(id); // reutilizamos el findOne del metodo de buscar un producto por el id

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {

    await this.findOne( id );

     // esto es un hard delete , pero no es recomendable porque no se sabe si el producto se est+a usando en otro lado o tenga
    // un relación integral con otro proceso o una transación.
    // por lo tanto se recomienda hacer una eliminación soft, que no es más que crear otra columna en el modelo de prisma
    // y cambiar el estado del producto y dejarlo inactivo.
    
    // return this.product.delete({
    //   where:{ id }
    // });

    const product = await this.product.update({
      where: { id },
      data : {
        available: false,
      }
    });

    return product;
  }
}
