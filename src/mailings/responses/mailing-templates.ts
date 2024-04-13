import { CreatePaginationProps } from 'src/libs/pagination/types';
import { MailingTemplate } from '../models/mailing-template.model';
import { InlineBtnType, emptyListBtn } from 'src/general';

export const mailingTemplatesMessage = () => `<b>Шаблоны рассылки:</b>`;

export const mailingTemplatesMarkup = async (
  templates: MailingTemplate[],
  createPagination: (
    conf: Omit<CreatePaginationProps, 'userId'>,
  ) => Promise<InlineBtnType[][]>,
) => {
  const templatesBtns = [];

  for (let { id, title } of templates) {
    templatesBtns.push({
      text: title,
      callback_data: `${id}::mailing_template_page`,
    });
  }

  if (!templates.length) {
    templatesBtns.push(emptyListBtn);
  }

  const pagination = await createPagination({
    items: templatesBtns,
    pageItemsCount: 5,
    rowLen: 1,
    isShowCount: true,
  });

  return {
    inline_keyboard: [
      ...pagination,
      [{ text: 'Добавить шаблон', callback_data: 'create_mailing_template' }],
      [{ text: '↩️ Назад', callback_data: 'back_create_mailing_template' }],
    ],
  };
};
