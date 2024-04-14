import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { StartModule } from './start/start.module';
import { MenuModule } from './menu/menu.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneralModule } from './general/general.module';
import { InfoModule } from './info/info.module';
import { validationSchema } from './libs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './general/database/database.module';
import { ListenersModule } from './listeners/listeners.module';
import { ListenersLowModule } from './listeners/listeners-low.module';
import { ProfileModule } from './profile/profile.module';
import { ChainModule } from './libs/chain/chain.module';
import { PaginationModule } from './libs/pagination/pagination.module';
import { MailingsModule } from './mailings/mailings.module';
import { RolesModule } from './roles/roles.module';
import { BansModule } from './bans/bans.module';
import { SearchModule } from './search/search.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: [`.${process.env.NODE_ENV}.env`, `.env.stage.dev`],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    GeneralModule,
    PaginationModule,
    ListenersModule,
    ChainModule,
    StartModule,
    MenuModule,
    InfoModule,
    UsersModule,
    ProfileModule,
    MailingsModule,
    RolesModule,
    BansModule,
    SearchModule,
    FeedbackModule,
    CoursesModule,

    // должно быть внизу из за приоритета выполнения
    ListenersLowModule,
  ],
})
export class AppModule {}
