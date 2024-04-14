import { Module, forwardRef } from '@nestjs/common';
import { FeedbackUpdate } from './feedback.update';
import { FeedbackService } from './feedback.service';
import { DatabaseModule } from 'src/libs/common';
import { SearchCoursesFeedback } from './models/search-courses-feedback.model';
import { SearchCoursesFeedbackRepository } from './repositories/search-courses-feedback.repository';
import { GeneralModule } from 'src/general/general.module';

@Module({
  imports: [
    DatabaseModule.forFeature([SearchCoursesFeedback]),
    forwardRef(() => GeneralModule),
  ],
  providers: [FeedbackUpdate, FeedbackService, SearchCoursesFeedbackRepository],
  exports: [FeedbackService],
})
export class FeedbackModule {}
