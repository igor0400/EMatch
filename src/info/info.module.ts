import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoUpdate } from './info.update';
import { GeneralModule } from '../general/general.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [GeneralModule, UsersModule],
  providers: [InfoService, InfoUpdate],
})
export class InfoModule {}
