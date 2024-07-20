import { Module } from '@nestjs/common';
import { CDEKApiProvider } from './cdekapi.service';
import { CDEK_API_INSTANCE_TOKEN } from './cdekapi.constants';

@Module({
  providers: [
    CDEKApiProvider,
    {
      provide: CDEK_API_INSTANCE_TOKEN,
      useFactory: (cdekApiProvider: CDEKApiProvider) => {
        return cdekApiProvider.getApi();
      },
      inject: [CDEKApiProvider],
    },
  ],
  exports: [CDEK_API_INSTANCE_TOKEN],
})
export class CdekapiModule {}
