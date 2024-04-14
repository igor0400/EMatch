import { formatKeyboard } from 'src/libs/common';
import { searchLangs } from '../configs/langs';
import { cancelBackInlineBtn } from 'src/general';

export const selectLanguageMessage = () => `👇 <b>Выберите язык:</b>`;

export const selectLanguageMarkup = () => {
  const langBtns = [];

  for (let langCode in searchLangs) {
    const { title } = searchLangs[langCode];

    langBtns.push({
      text: title,
      callback_data: `${langCode}::select_search_lang`,
    });
  }

  return {
    inline_keyboard: [...formatKeyboard(langBtns, 2), cancelBackInlineBtn],
  };
};

export const sendGoalMessage = () =>
  `📝 <b>Отправьте тему или название курса:</b>`;

export const sendPriceMessage = () => `💰 <b>Отправьте цену курса в рублях:</b>

ℹ️ <i>В формате "\<от\>—\<до\>", просто "\<до\>", или <code>0</code> для получения бесплатных курсов
Пример: 1000-30000</i>
`;
