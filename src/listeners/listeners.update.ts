import { Ctx, On, Update } from 'nestjs-telegraf';
import { ListenersService } from './listeners.service';
import { Context } from 'telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { ChainService } from 'src/libs/chain/chain.service';
import { MailingsService } from 'src/mailings/mailings.service';

@Update()
export class ListenersUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly listenersService: ListenersService,
    private readonly chainService: ChainService,
    private readonly mailingsService: MailingsService,
  ) {}

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, async (ctx: Context) => {
      await this.listenersService.onTextMessage(ctx);
      await this.chainService.onTextMessage(ctx);
      await this.mailingsService.onTextMessage(ctx);
    });
  }

  @On('photo')
  async onImage(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, async (ctx: Context) => {
      await this.chainService.onImageMessage(ctx);
      await this.mailingsService.onPhotoMessage(ctx);
    });
  }

  @On('animation')
  async onAnimation(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, (ctx: Context) =>
      this.mailingsService.onAnimationMessage(ctx),
    );
  }

  @On('audio')
  async onAudio(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, (ctx: Context) =>
      this.mailingsService.onAudioMessage(ctx),
    );
  }

  @On('voice')
  async onVoice(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, (ctx: Context) =>
      this.mailingsService.onVoiceMessage(ctx),
    );
  }

  @On('video')
  async onVideo(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, (ctx: Context) =>
      this.mailingsService.onVideoMessage(ctx),
    );
  }

  @On('sticker')
  async onSticker(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, (ctx: Context) =>
      this.mailingsService.onStickerMessage(ctx),
    );
  }

  @On('document')
  async onFile(@Ctx() ctx: Context) {
    await this.middlewares.listenerMiddleware(ctx, async (ctx: Context) => {
      await this.listenersService.onFileMessage(ctx);
      await this.chainService.onFileMessage(ctx);
      await this.mailingsService.onDocumentMessage(ctx);
    });
  }
}
