import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Context } from 'telegraf';
import { StartService } from './start.service';

@Injectable()
export class StartArgsService {
  constructor(
    @Inject(forwardRef(() => StartService))
    private readonly startService: StartService,
  ) {}

  async argsHandler(ctx: Context | any) {
    const args = ctx?.args[0]?.split('-');
    const serviceType = args[0];

    if (serviceType === 'что-то') {
      // вернуть что-то
      // return await this.referralsService.argsHandler(ctx);
    }

    await this.startService.sendStartMessage(ctx);
  }
}
