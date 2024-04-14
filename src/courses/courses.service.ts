import { Injectable } from '@nestjs/common';
import { Course } from './types';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { sendMessage } from 'src/general';
import { courseMarkup, courseMessage } from './responses';
import { timeout } from 'src/libs/common';

@Injectable()
export class CoursesService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  async sendCourses(chatId: string, courses: Course[]) {
    if (!courses?.length) return;

    for (let course of courses) {
      await sendMessage(courseMessage(course), {
        bot: this.bot,
        chatId,
        isBanner: true,
        type: 'send',
        banner_url: course.cover,
        reply_markup: courseMarkup(course.course_url),
      });
      await timeout(300);
    }
  }
}
