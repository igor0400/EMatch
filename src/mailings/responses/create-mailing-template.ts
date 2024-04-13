export const setMailingTemplateTitleMessage = () =>
  `<b>Отправьте название шаблона рассылки:</b>`;

export const setMailingTemplateTitleMarkup = {
  inline_keyboard: [
    [{ text: '❌ Отменить', callback_data: 'mailing_templates' }],
  ],
};

export const createMailingTemplateMessage = () => `<b>Шаблон рассылки</b>

Отправьте сообщение рассылки, это может быть: <b>фото, файл (любой формат), голосовое сообщение, видео, GIF или текст</b>.

ℹ️ <i>Вы можете добавить описание к сообщению, а так же использовать <a href="https://core.telegram.org/api/entities">HTML форматирование</a> текста.</i>`;

export const createMailingTemplateMarkup = {
  inline_keyboard: [
    [{ text: '❌ Отменить', callback_data: 'mailing_templates' }],
  ],
};
