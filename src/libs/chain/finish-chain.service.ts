import { Injectable } from '@nestjs/common';
import { ChainRepository } from './repositories/chain.repository';
import { ChainField } from './models/chain-field.model';
import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { SearchService } from 'src/search/search.service';
import { getCtxData } from '../common';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class FinishChainService {
  constructor(
    private readonly chainRepository: ChainRepository,
    private readonly searchService: SearchService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async finishChain(ctx: Context, type: string, userId: string) {
    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };
    const { ctxUser } = getCtxData(ctx);

    const chain = await this.chainRepository.findOne({
      where: {
        userId,
      },
      include: [ChainField],
    });
    const { fields, extraData, chatId, messageId } = chain;

    if (type === 'search_course') {
      const data: any = this.getDataFromChainFields(fields);

      this.searchService.sendCoursesByData({
        userTgId: ctxUser.id,
        title: String(data.title),
        price: data.price ? String(data.price) : null,
        language: extraData,
      });

      try {
        await this.bot.telegram.deleteMessage(chatId, +messageId);
      } catch (e) {}
    }

    return finishMessage;
  }

  private getDataFromChainFields(fields: ChainField[]) {
    const data = {};

    for (let field of fields) {
      data[field.title] = field.userResponse;
    }

    return data;
  }
}
