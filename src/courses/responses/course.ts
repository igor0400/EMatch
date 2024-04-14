import { Course } from '../types';

export const courseMessage = ({ title, summary, tags, price }: Course) => {
  let tagsStr = '';

  if (tags?.length) {
    for (let tagI in tags) {
      const tag = tags[tagI];

      if (+tagI === 0) {
        tagsStr += `#${tag}`;
      } else {
        tagsStr += ` #${tag}`;
      }
    }
  }

  return `${tagsStr}

Название: <b>${title}</b>${summary ? `\nОписание: <b>${summary}</b>` : ''}
${price ? `Цена: <code>${price}</code>` : ''}`;
};

export const courseMarkup = (courseUrl: string) => ({
  inline_keyboard: [[{ text: '📰 Открыть', url: courseUrl }]],
});
