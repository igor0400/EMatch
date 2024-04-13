import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ProfileService } from './profile.service';
import { GeneralMiddlewares } from 'src/general/general.middlewares';

@Update()
export class ProfileUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly profileService: ProfileService,
  ) {}

  @Command('profile')
  async profileCommand(@Ctx() ctx: Context) {
    await this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.profileService.sendProfile(ctx),
    );
  }

  @Action(['profile', 'back_to_profile'])
  async profileBtn(@Ctx() ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, (ctx: Context) =>
      this.profileService.changeToProfile(ctx),
    );
  }
}
