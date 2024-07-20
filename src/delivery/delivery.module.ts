import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { HttpModule } from '@nestjs/axios';
import { CDEKService } from '../cdek/cdek.service';
import { KazPostService } from '../kaz-post/kaz-post.service';
import { CdekapiModule } from '../api/cdek/cdekapi.module';

@Module({
  imports: [HttpModule, CdekapiModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, CDEKService, KazPostService],
})
export class DeliveryModule {}
