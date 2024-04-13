import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { BanUser } from './models/ban-user.model';
import { BanUserRepository } from './repositories/ban-user.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule.forFeature([BanUser]), UsersModule],
  providers: [BanUserRepository],
  exports: [BanUserRepository],
})
export class BansModule {}
