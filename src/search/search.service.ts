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

@Injectable()
export class SearchService {
  constructor(
    @Inject(forwardRef(() => ChainService))
    private readonly chainService: ChainService,
    private readonly generalPresets: GeneralPresets,
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
      title,
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

    // post request with requestData
    await timeout(3000);

    await loading.stopAndDelete();

    await sendMessage(`вот ваш курс!!!, ${JSON.stringify(requestData)}`, {
      bot: this.bot,
      chatId: userTgId,
      isBanner: false,
      type: 'send',
    });

    console.log(requestData);
  }
}
