import { Injectable } from '@nestjs/common';
import { sendMessage } from 'src/general';
import { Context, Telegraf } from 'telegraf';
import { searchFeedbackMarkup, searchFeedbackMessage } from './responses';
import { getCtxData } from 'src/libs/common';
import { SearchCoursesFeedbackRepository } from './repositories/search-courses-feedback.repository';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly searchCoursesFeedbackRepository: SearchCoursesFeedbackRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async sendFeedbackMessage(userTgId: string) {
    await sendMessage(searchFeedbackMessage(), {
      bot: this.bot,
      chatId: userTgId,
      isBanner: false,
      type: 'send',
      reply_markup: searchFeedbackMarkup(),
    });
  }

  async createSearchFeedback(ctx: Context) {
    const { dataValue } = getCtxData(ctx);

    await this.searchCoursesFeedbackRepository.create({
      title: '',
      price: '',
      language: '',
      foundedCourses: '',
      userFeedback: dataValue === 'like',
    });

    await sendMessage('<b>Спасибо за отзыв!<b> 😘', {
      ctx,
      isBanner: false,
    });
  }
}
