import { Module, forwardRef } from '@nestjs/common';
import { SearchUpdate } from './search.update';
import { SearchService } from './search.service';
import { ChainModule } from 'src/libs/chain/chain.module';
import { GeneralModule } from 'src/general/general.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  imports: [
    forwardRef(() => ChainModule),
    forwardRef(() => GeneralModule),
    FeedbackModule,
    CoursesModule,
  ],
  providers: [SearchService, SearchUpdate],
  exports: [SearchService],
})
export class SearchModule {}
