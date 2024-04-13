export const menuMessage = () => `<b>Привет братанчик! 👋</b>

Зачем пожаловал?`;

export const menuMarkup = {
  inline_keyboard: [
    [
      { text: 'ℹ️ Информация', callback_data: 'info' },
      { text: '👤 Профиль', callback_data: 'profile' },
    ],
    [{ text: '🔎 Найти курс', callback_data: 'search_course' }],
  ],
};
