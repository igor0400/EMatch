import { Injectable } from '@nestjs/common';
import { ChainService } from 'src/libs/chain/chain.service';
import { Context } from 'telegraf';
import { sendGoalMessage, sendPriceMessage } from './responses';

@Injectable()
export class SearchService {
  constructor(private readonly chainService: ChainService) {}

  async changeToCollectSearchData(ctx: Context) {
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
    });

    // после выбор языка на кнопках (в апи отдавать язык в формате всех апишек)
  }
}
