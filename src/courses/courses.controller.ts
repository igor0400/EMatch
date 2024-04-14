import { Body, Controller, Post } from '@nestjs/common';
import { Course } from './types';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('post-to-channel')
  async postToChannel(@Body() courses: Course[]) {
    if (!courses?.length) return;

    await this.coursesService.sendCourses(process.env.CHANNEL_ID, courses);
  }
}
