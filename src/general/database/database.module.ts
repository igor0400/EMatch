import { Module } from '@nestjs/common';
import { BanUser } from 'src/bans/models/ban-user.model';
import { SearchCoursesFeedback } from 'src/feedback/models/search-courses-feedback.model';
import { ChainField } from 'src/libs/chain/models/chain-field.model';
import { Chain } from 'src/libs/chain/models/chain.model';
import { DatabaseModule as AppDatabaseModule } from 'src/libs/common';
import { Pagination } from 'src/libs/pagination/models/pagination.model';
import { Waiter } from 'src/listeners/models/waiter.model';
import { MailingQueueItem } from 'src/mailings/models/mailing-queue-item.model';
import { MailingTemplate } from 'src/mailings/models/mailing-template.model';
import { Mailing } from 'src/mailings/models/mailing.model';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { User } from 'src/users/models/user.model';

@Module({
  imports: [
    AppDatabaseModule.forRoot([
      User,
      Waiter,
      Pagination,
      BanUser,
      Chain,
      ChainField,
      UserRoles,
      Mailing,
      MailingTemplate,
      MailingQueueItem,
      SearchCoursesFeedback,
    ]),
  ],
})
export class DatabaseModule {}
