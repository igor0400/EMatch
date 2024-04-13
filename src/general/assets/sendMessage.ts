import { formatHTML, replyPhoto } from 'src/libs/common';
import { Context, Telegraf } from 'telegraf';
import {
  InlineKeyboardMarkup,
  ParseMode,
} from 'telegraf/typings/core/types/typegram';

interface MessageSettings {
  ctx?: Context;
  bot?: Telegraf<Context>;
  type?: 'send' | 'edit';
  parse_mode?: ParseMode;
  isBanner?: boolean;
  reply_markup?: InlineKeyboardMarkup;
  chatId?: string | number;
  messageId?: number;
  inlineMessageId?: string;
  reply_to_message_id?: number;
}

export const sendMessage = async (
  message: string,
  {
    ctx,
    bot,
    type = 'edit',
    parse_mode = 'HTML',
    isBanner,
    reply_markup,
    chatId,
    messageId,
    inlineMessageId,
    ...extra
  }: MessageSettings,
) => {
  try {
    const formatedMessage = formatHTML(message);
    const messageExtra = {
      ...extra,
      parse_mode,
      reply_markup,
      disable_web_page_preview: true,
    };

    let isHaveBanner = isBanner ?? Boolean(process.env.BANNER_URL);

    const photoData = replyPhoto();

    if (ctx) {
      if (type === 'edit') {
        if (isHaveBanner) {
          return await ctx.editMessageCaption(formatedMessage, messageExtra);
        } else {
          return await ctx.editMessageText(formatedMessage, messageExtra);
        }
      } else {
        if (isHaveBanner) {
          return await ctx.sendPhoto(photoData, {
            ...messageExtra,
            caption: formatedMessage,
          });
        } else {
          return await ctx.sendMessage(formatedMessage, messageExtra);
        }
      }
    }

    if (bot) {
      if (type === 'edit') {
        if (isHaveBanner) {
          return await bot.telegram.editMessageCaption(
            chatId,
            messageId,
            inlineMessageId,
            formatedMessage,
            messageExtra,
          );
        } else {
          return await bot.telegram.editMessageText(
            chatId,
            messageId,
            inlineMessageId,
            formatedMessage,
            messageExtra,
          );
        }
      } else {
        if (isHaveBanner) {
          return await bot.telegram.sendPhoto(chatId, photoData, {
            ...messageExtra,
            caption: formatedMessage,
          });
        } else {
          return await bot.telegram.sendMessage(
            chatId,
            formatedMessage,
            messageExtra,
          );
        }
      }
    }
  } catch (e) {
    console.log('sendMessage error:', e);
  }
};
