import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Connection } from 'mongoose';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: async (connection: Connection) => {
          const schema = OrderSchema;
          schema.plugin(AutoIncrementFactory(connection), {
            id: 'orders',
            inc_field: 'id',
            start_seq: 100,
          });
          return schema;
        },
        inject: [getConnectionToken('')],
      },
    ]),
    HttpModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
