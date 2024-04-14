import { Action, Ctx, Update } from 'nestjs-telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { FeedbackService } from './feedback.service';
import { Context } from 'telegraf';

@Update()
export class FeedbackUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Action(/.*::send_search_cource_feedback/)
  async sendSearchCourceFeedbackBtn(@Ctx() ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, (ctx: Context) =>
      this.feedbackService.createSearchFeedback(ctx),
    );
  }
}
