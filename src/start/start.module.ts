import { Module } from '@nestjs/common';
import { StartService } from './start.service';
import { StartUpdate } from './start.update';
import { MenuModule } from '../menu/menu.module';
import { GeneralModule } from '../general/general.module';
import { StartArgsService } from './args.service';

@Module({
  imports: [MenuModule, GeneralModule],
  providers: [StartService, StartUpdate, StartArgsService],
  exports: [StartService],
})
export class StartModule {}
