import { backInlineBtn } from '../../general';

export const infoMessage = () => `<b>Информация</b>

💡 По всем вопросам и предложениям образаться в администрации.`;

export const infoMarkup = () => ({
  inline_keyboard: [
    [{ text: '📨 Наш канал', url: 't.me/EMatchCourses' }],
    [{ text: '👤 Поддержка', url: `tg://user?id=${process.env.ADMIN_TG_ID}` }],
    backInlineBtn,
  ],
});
