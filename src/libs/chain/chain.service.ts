import { Injectable } from '@nestjs/common';
import { ChainRepository } from './repositories/chain.repository';
import { ChainFieldRepository } from './repositories/chain-field.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ChainField } from './models/chain-field.model';
import { CreateChainType } from './types';
import { getCtxData, sendTempMessage } from '../common';
import { Context, Telegraf } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { InjectBot } from 'nestjs-telegraf';
import { MenuService } from 'src/menu/menu.service';
import { GeneralValidations } from 'src/general/general.validations';
import { validationTemplates } from './configs';
import { chainRieldMarkup } from './responses';
import { sendMessage } from 'src/general';
import { GeneralPresets } from 'src/general/general.presets';
import { FinishChainService } from './finish-chain.service';

@Injectable()
export class ChainService {
  constructor(
    private readonly chainRepository: ChainRepository,
    private readonly chainFieldRepository: ChainFieldRepository,
    private readonly userRepository: UserRepository,
    private readonly menuService: MenuService,
    private readonly generalValidations: GeneralValidations,
    private readonly generalPresets: GeneralPresets,
    private readonly finishChainService: FinishChainService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async clearUserChains(userTgId: string, isDeleteFiles = true) {
    const user = await this.userRepository.findByTgId(userTgId);
    if (!user) return;

    const chain = await this.chainRepository.findOne({
      where: {
        userId: user.id,
      },
      include: [ChainField],
    });
    if (!chain) return;

    if (isDeleteFiles) {
      // for (let field of chain.fields) {
      //   if (
      //     (field.type === 'image' || field.type === 'file') &&
      //     field.userResponse
      //   ) {
      //     this.filesService.deleteFile(String(field.userResponse));
      //   }
      // }
    }

    await this.chainRepository.destroy({ where: { id: chain.id } });
    await this.chainFieldRepository.destroy({
      where: {
        chainId: chain.id,
      },
    });
  }

  async onTextMessage(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);

    const commonData = await this.getCommonData(ctx);
    if (!commonData) return;

    const { message, userId, chain, currField } = commonData;

    const { type, extraData, chatId, messageId, isCancel, fields } = chain;
    const text = message.text?.trim();

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };

    const { validations } = currField;

    if (!text) {
      return await sendTempMessage({
        ctx,
        bot: this.bot,
        text: '<b>🚫 Введите корректное значение.</b>',
      });
    }

    const preparedValidations = [];

    if (validations) {
      for (let { name, value } of JSON.parse(validations)) {
        if (validationTemplates[name]) {
          preparedValidations.push(validationTemplates[name](text, value));
        }
      }
    }

    const isValid = await this.generalValidations.startValidation(ctx, [
      {
        stipulation: currField.type !== 'text',
        text: '🚫 <b>Ошибка, попробуйте еще раз</b>',
      },
      ...preparedValidations,
    ]);

    if (!isValid) return;

    await this.chainFieldRepository.update(
      {
        userResponse: text,
      },
      {
        where: {
          id: currField.id,
        },
      },
    );

    const nextField = fields[currField.serNum + 1];

    if (nextField) {
      finishMessage = {
        text: nextField.text,
        markup: chainRieldMarkup(isCancel, nextField),
      };
    } else {
      finishMessage = await this.finishChainService.finishChain(
        ctx,
        type,
        userId,
      );
      await this.clearUserChains(ctxUser.id, false);
    }

    if (finishMessage) {
      await sendMessage(finishMessage.text, {
        bot: this.bot,
        chatId,
        messageId: +messageId,
        reply_markup: finishMessage.markup,
      });
    }
  }

  async onImageMessage(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const commonData = await this.getCommonData(ctx);
    if (!commonData) return;

    const { message, userId, chain, currField } = commonData;
    const { type, extraData, chatId, messageId, isCancel, fields } = chain;

    const isValid = await this.generalValidations.startValidation(ctx, [
      {
        stipulation: currField.type !== 'image',
        text: '🚫 <b>Ошибка, попробуйте еще раз</b>',
      },
    ]);
    if (!isValid) return;

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };

    const loading = await this.generalPresets.sendLoading(ctx);

    try {
      // const url = await ctx.telegram.getFileLink(message.photo[2].file_id);

      // const fileUrl = await this.filesService.createFileByUrl(url);

      // if (!fileUrl) {
      //   throw new Error('Ошибка получения url файла');
      // }

      // await this.chainFieldRepository.update(
      //   {
      //     userResponse: fileUrl,
      //   },
      //   {
      //     where: {
      //       id: currField.id,
      //     },
      //   },
      // );

      const nextField = fields[currField.serNum + 1];

      if (nextField) {
        finishMessage = {
          text: nextField.text,
          markup: chainRieldMarkup(isCancel, nextField),
        };
      } else {
        finishMessage = await this.finishChainService.finishChain(
          ctx,
          type,
          userId,
        );
        await this.clearUserChains(ctxUser.id, false);
      }

      await loading.stopAndDelete();

      if (finishMessage) {
        await sendMessage(finishMessage.text, {
          bot: this.bot,
          chatId,
          messageId: +messageId,
          reply_markup: finishMessage.markup,
        });
      }
    } catch (e) {
      await loading.stopAndDelete();
      await sendTempMessage({
        ctx,
        bot: this.bot,
        text: '🚫 <b>Ошибка загрузки изображения.</b>',
      });
      console.log('Ошибка загрузки изображения:', e);
    }
  }

  async onFileMessage(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const commonData = await this.getCommonData(ctx);
    if (!commonData) return;

    const { message, userId, chain, currField } = commonData;
    const { type, extraData, chatId, messageId, isCancel, fields } = chain;

    const isValid = await this.generalValidations.startValidation(ctx, [
      {
        stipulation: currField.type !== 'file',
        text: '🚫 <b>Ошибка, попробуйте еще раз</b>',
      },
    ]);
    if (!isValid) return;

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };

    const loading = await this.generalPresets.sendLoading(ctx);

    try {
      // const url = await ctx.telegram.getFileLink(message.document.file_id);

      // const splitHref = url?.href?.split('.');
      // const fileUrl = await this.filesService.createFileByUrl(
      //   url,
      //   splitHref[splitHref?.length - 1],
      // );

      // if (!fileUrl) {
      //   throw new Error('Ошибка получения url файла');
      // }

      // await this.chainFieldRepository.update(
      //   {
      //     userResponse: fileUrl,
      //   },
      //   {
      //     where: {
      //       id: currField.id,
      //     },
      //   },
      // );

      const nextField = fields[currField.serNum + 1];

      if (nextField) {
        finishMessage = {
          text: nextField.text,
          markup: chainRieldMarkup(isCancel, nextField),
        };
      } else {
        finishMessage = await this.finishChainService.finishChain(
          ctx,
          type,
          userId,
        );
        await this.clearUserChains(ctxUser.id, false);
      }

      await loading.stopAndDelete();

      if (finishMessage) {
        await sendMessage(finishMessage.text, {
          bot: this.bot,
          chatId,
          messageId: +messageId,
          reply_markup: finishMessage.markup,
        });
      }
    } catch (e) {
      await loading.stopAndDelete();
      await sendTempMessage({
        ctx,
        bot: this.bot,
        text: '🚫 <b>Ошибка загрузки файла.</b>',
      });
      console.log('Ошибка загрузки файла:', e);
    }
  }

  async skipChainField(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);

    const commonData = await this.getCommonData(ctx, false);
    if (!commonData) return;

    const { userId, chain, currField } = commonData;
    const { type, isCancel, fields } = chain;

    await this.chainFieldRepository.update(
      { isSkipped: true },
      { where: { id: currField.id } },
    );

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    };

    const nextField = fields[currField.serNum + 1];

    if (nextField) {
      finishMessage = {
        text: nextField.text,
        markup: chainRieldMarkup(isCancel, nextField),
      };
    } else {
      finishMessage = await this.finishChainService.finishChain(
        ctx,
        type,
        userId,
      );
      await this.clearUserChains(ctxUser.id, false);
    }

    if (finishMessage) {
      await sendMessage(finishMessage.text, {
        ctx,
        reply_markup: finishMessage.markup,
      });
    }
  }

  private async getCommonData(ctx: Context, isDeleteMess: boolean = true) {
    const { message, ctxUser } = getCtxData(ctx);
    const userTgId = ctxUser.id;

    const user = await this.userRepository.findByTgId(userTgId);
    const userId = user?.id;
    const chain = await this.chainRepository.findOne({
      where: { userId },
      include: [
        { model: ChainField, separate: true, order: [['serNum', 'ASC']] },
      ],
    });

    if (!chain) return;

    if (isDeleteMess) {
      try {
        await ctx.deleteMessage();
      } catch (e) {}
    }

    let currField: ChainField;

    for (let field of chain.fields) {
      if (!field.userResponse && !field.isSkipped) {
        currField = field;
        break;
      }
    }

    return { message, userId, chain, currField };
  }

  async createChain({
    ctx,
    isCancel = true,
    type,
    fields,
    extraData,
  }: CreateChainType) {
    const { message, ctxUser } = getCtxData(ctx);
    const user = await this.userRepository.findByTgId(ctxUser?.id);
    if (!user) return;

    const chain = await this.chainRepository.create({
      type,
      isCancel,
      userId: user.id,
      chatId: message.chat.id,
      messageId: message.message_id,
      extraData,
    });
    if (!chain) return;
    if (!fields.length) return;

    const chainFields = [];

    for (let i in fields) {
      const chainField = await this.chainFieldRepository.create({
        chainId: chain.id,
        serNum: +i,
        ...fields[i],
      });
      chainFields.push(chainField);
    }

    await sendMessage(fields[0]?.text, {
      ctx,
      reply_markup: chainRieldMarkup(isCancel, fields[0]),
    });

    return {
      chain,
      fields: chainFields,
    };
  }

  async cancelChain(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    await this.clearUserChains(ctxUser?.id);
    await this.menuService.changeToMenu(ctx);
  }
}
