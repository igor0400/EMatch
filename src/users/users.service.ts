import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from './repositories/user.repository';
import { UserRolesRepository } from 'src/roles/repositories/user-roles.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRolesRepository: UserRolesRepository,
  ) {}

  async updateUserNamesByCtx(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const telegramId = ctxUser.id;
    const firstName = ctxUser.first_name?.trim();
    const lastName = ctxUser.last_name?.trim();
    const userName = ctxUser.username?.trim();

    await this.userRepository.update(
      { firstName, lastName, userName },
      { where: { telegramId } },
    );
  }

  async findOrCreateUserByCtx(ctx: Context | any) {
    const { ctxUser } = getCtxData(ctx);
    const { id, first_name, last_name, username } = ctxUser;

    const isCreated = await this.userRepository.findByTgId(id);
    if (isCreated) return isCreated;

    const user = await this.userRepository.create({
      telegramId: id,
      firstName: first_name?.trim(),
      lastName: last_name?.trim(),
      userName: username?.trim(),
    });

    if (username == process.env.ADMIN_USERNAME) {
      await this.userRolesRepository.create({
        userId: user.id,
        roleName: 'ADMIN',
      });
    }

    return user;
  }
}
