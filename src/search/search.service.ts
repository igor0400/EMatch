import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ChainService } from 'src/libs/chain/chain.service';
import { Context, Telegraf } from 'telegraf';
import {
  selectLanguageMarkup,
  selectLanguageMessage,
  sendGoalMessage,
  sendPriceMessage,
} from './responses';
import { sendMessage } from 'src/general';
import { getCtxData, timeout } from 'src/libs/common';
import { GeneralPresets } from 'src/general/general.presets';
import { InjectBot } from 'nestjs-telegraf';
import axios from 'axios';
import { FeedbackService } from 'src/feedback/feedback.service';
import { CoursesService } from 'src/courses/courses.service';
import { menuMarkup, menuMessage } from 'src/menu/responses';

const testResponse = [
  {
    course_url: 'https://stepik.org/course/125756/promo?search=3800666703',
    cover:
      'https://cdn.stepik.net/media/cache/images/courses/125756/cover_y5VlHKD/a04e8cd839f39ace3e389b8d3e8a34ce.png',
    summary: '',
    tags: [],
    title: 'Практический мини-курс по JavaScript и Bootstrap 5',
  },
  {
    course_url: 'https://stepik.org/course/125756/promo?search=3800666703',
    cover:
      'https://cdn.stepik.net/media/cache/images/courses/125756/cover_y5VlHKD/a04e8cd839f39ace3e389b8d3e8a34ce.png',
    summary: '',
    tags: [],
    title: 'Практический мини-курс по JavaScript и Bootstrap 5',
  },
  {
    course_url: 'https://stepik.org/course/125756/promo?search=3800666703',
    cover:
      'https://cdn.stepik.net/media/cache/images/courses/125756/cover_y5VlHKD/a04e8cd839f39ace3e389b8d3e8a34ce.png',
    summary: '',
    tags: [],
    title: 'Практический мини-курс по JavaScript и Bootstrap 5',
  },
];

@Injectable()
export class SearchService {
  constructor(
    @Inject(forwardRef(() => ChainService))
    private readonly chainService: ChainService,
    private readonly generalPresets: GeneralPresets,
    private readonly feedbackService: FeedbackService,
    private readonly coursesService: CoursesService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async changeToSelectLanguage(ctx: Context) {
    await sendMessage(selectLanguageMessage(), {
      ctx,
      reply_markup: selectLanguageMarkup(),
    });
  }

  async changeToCollectSearchData(ctx: Context) {
    const { dataValue } = getCtxData(ctx);

    await this.chainService.createChain({
      ctx,
      isCancel: true,
      type: 'search_course',
      fields: [
        {
          title: 'title',
          text: sendGoalMessage(),
          type: 'text',
          cancelBtnCallbackData: 'back',
          isSkip: false,
        },
        {
          title: 'price',
          text: sendPriceMessage(),
          type: 'text',
          cancelBtnCallbackData: 'back',
          isSkip: true,
        },
      ],
      extraData: dataValue,
    });
  }

  async sendCoursesByData({
    userTgId,
    title,
    price,
    language,
  }: {
    userTgId: string;
    title: string;
    price: string | null;
    language: string;
  }) {
    const loading = await this.generalPresets.sendLoading(
      undefined,
      '🔎 Ищу подходящие курсы',
      userTgId,
    );

    const requestData: any = {
      userRequest: title,
      language,
      minPrice: false,
      maxPrice: false,
    };

    const isPriceValid = price && /\d/gi.test(price);

    if (isPriceValid && price.includes('-')) {
      const [min, max] = price.split('-');

      requestData.minPrice = +min.replaceAll(/!\w/gi, '') ?? false;
      requestData.maxPrice = +max.replaceAll(/!\w/gi, '') ?? false;
    } else if (price === '0') {
      requestData.minPrice = 0;
      requestData.maxPrice = 0;
    } else if (isPriceValid) {
      requestData.maxPrice = +price.replaceAll(/!\w/gi, '') ?? false;
    }

    let courses;

    try {
      const response = await axios.post(
        'http://localhost:10000/search',
        requestData,
      );

      courses = response.data;
    } catch (e) {}

    await loading.stopAndDelete();

    if (courses) {
      await this.coursesService.sendCourses(userTgId, testResponse);

      await this.feedbackService.sendFeedbackMessage(userTgId);
    } else {
      await sendMessage('<b>Ничего не найдено</b> 🤷‍♂️', {
        bot: this.bot,
        chatId: userTgId,
        type: 'send',
        isBanner: false,
      });
    }

    await sendMessage(menuMessage(), {
      bot: this.bot,
      chatId: userTgId,
      reply_markup: menuMarkup,
      type: 'send',
    });
  }
}
