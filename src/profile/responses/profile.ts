import { backInlineBtn } from 'src/general';
import { getUserName } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export const profileMessage = (user: User) => `<b>Профиль</b>

🎓 <b>Вы:</b> ${getUserName(user)}
🔢 <b>Ваш ID:</b> <code>${user.id}</code>`;

export const profileMarkup = () => ({
  inline_keyboard: [backInlineBtn],
});
