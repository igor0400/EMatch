import { Context, Telegraf } from 'telegraf';
import { formatHTML } from './formatHTML';

interface Props {
  bot: Telegraf<Context>;
  ctx: Context;
  text: string;
  isDeleteInitMess?: boolean;
  time?: number;
}

interface ChatIdProps {
  bot: Telegraf<Context>;
  chatId: string | number;
  text: string;
  isDeleteInitMess?: boolean;
  time?: number;
}

export const sendTempMessage = async ({
  bot,
  ctx,
  text,
  isDeleteInitMess = false,
  time = 3000,
}: Props) => {
  const messText = formatHTML(text);

  const mess = await ctx.reply(messText, {
    parse_mode: 'HTML',
    disable_notification: true,
    disable_web_page_preview: true,
  });

  setTimeout(async () => {
    if (isDeleteInitMess) {
      try {
        await ctx.deleteMessage();
      } catch (e) {}
    }
    try {
      await bot.telegram.deleteMessage(mess.chat.id, mess.message_id);
    } catch (e) {}
  }, time);
};

export const sendTempChatIdMessage = async ({
  bot,
  chatId,
  text,
  time = 3000,
}: ChatIdProps) => {
  const messText = formatHTML(text);

  const mess = await bot.telegram.sendMessage(chatId, messText, {
    parse_mode: 'HTML',
    disable_notification: true,
    disable_web_page_preview: true,
  });

  setTimeout(async () => {
    try {
      await bot.telegram.deleteMessage(mess.chat.id, mess.message_id);
    } catch (e) {}
  }, time);
};
