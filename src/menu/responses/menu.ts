export const menuMessage = () => `<b>Привет друг! 👋</b>

Ты забрел на бота для поиска курсов, он поможет тебе обрести истенные знания и перенять опыт наших предков.

<i>Еще можешь заглянуть в наш канал в разделе "Информация", туда мы выкладываем интересные курсы.</i>`;

export const menuMarkup = {
  inline_keyboard: [
    [
      { text: 'ℹ️ Информация', callback_data: 'info' },
      { text: '👤 Профиль', callback_data: 'profile' },
    ],
    [{ text: '🔎 Найти курс', callback_data: 'search_course' }],
  ],
};
