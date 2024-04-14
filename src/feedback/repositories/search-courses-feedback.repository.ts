import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  SearchCoursesFeedback,
  SearchCoursesFeedbackCreationArgs,
} from '../models/search-courses-feedback.model';

@Injectable()
export class SearchCoursesFeedbackRepository extends AbstractRepository<
  SearchCoursesFeedback,
  SearchCoursesFeedbackCreationArgs
> {
  protected readonly logger = new Logger(SearchCoursesFeedback.name);

  constructor(
    @InjectModel(SearchCoursesFeedback)
    private searchCoursesFeedbackModel: typeof SearchCoursesFeedback,
  ) {
    super(searchCoursesFeedbackModel);
  }
}
