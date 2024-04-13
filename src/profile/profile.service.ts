import { Injectable } from '@nestjs/common';
import { getCtxData } from 'src/libs/common';
import { Context } from 'telegraf';
import { profileMarkup, profileMessage } from './responses';
import { UserRepository } from 'src/users/repositories/user.repository';
import { sendMessage } from 'src/general';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async sendProfile(ctx: Context) {
    await this.profileDefaultHandler(ctx, 'send');
  }

  async changeToProfile(ctx: Context) {
    await this.profileDefaultHandler(ctx, 'change');
  }

  private async profileDefaultHandler(
    ctx: Context,
    type: 'change' | 'send' = 'send',
  ) {
    const { ctxUser } = getCtxData(ctx);
    const userTgId = ctxUser.id;
    const user = await this.userRepository.findByTgId(userTgId);

    if (type === 'change') {
      await sendMessage(profileMessage(user), {
        ctx,
        reply_markup: profileMarkup(),
      });
    } else {
      await sendMessage(profileMessage(user), {
        ctx,
        type: 'send',
        reply_markup: profileMarkup(),
      });
    }
  }
}
