import { Module, forwardRef } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchUpdate } from './search.update';
import { SearchService } from './search.service';
import { ChainModule } from 'src/libs/chain/chain.module';
import { GeneralModule } from 'src/general/general.module';

@Module({
  imports: [forwardRef(() => ChainModule), forwardRef(() => GeneralModule)],
  controllers: [SearchController],
  providers: [SearchService, SearchUpdate],
  exports: [SearchService],
})
export class SearchModule {}
