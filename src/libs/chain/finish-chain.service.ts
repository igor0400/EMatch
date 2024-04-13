import { Injectable } from '@nestjs/common';
import { ChainRepository } from './repositories/chain.repository';
import { ChainField } from './models/chain-field.model';
import { Context } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class FinishChainService {
  constructor(private readonly chainRepository: ChainRepository) {}

  async finishChain(ctx: Context, type: string, userId: string) {
    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };

    const chain = await this.chainRepository.findOne({
      where: {
        userId,
      },
      include: [ChainField],
    });
    const { fields, extraData } = chain;

    if (type === 'search_course') {
      const data: any = this.getDataFromChainFields(fields);

      console.log(data);
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
