export const banMessage = (reason: string) => {
  return `<b>Вы заблокированы</b>

⛔ <b>Вас заблокировал администратор.</b>
${reason ? `🗣 <b>Причина:</b> <code>${reason}</code>` : ''}
`;
};

export const banMarkup = (adminTgId: string) => ({
  inline_keyboard: [
    [{ text: '💻 Администратор', url: `tg://user?id=${adminTgId}` }],
  ],
});
