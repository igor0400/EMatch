export const searchFeedbackMessage = () => `<b>Оцените качество ответа:</b>`;

export const searchFeedbackMarkup = () => ({
  inline_keyboard: [
    [
      { text: '👍', callback_data: 'like::send_search_cource_feedback' },
      { text: '👎', callback_data: 'dislike::send_search_cource_feedback' },
    ],
  ],
});
