import { Action, Ctx, Update } from 'nestjs-telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { Context } from 'telegraf';
import { SearchService } from './search.service';

@Update()
export class SearchUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly searchService: SearchService,
  ) {}

  @Action('search_course')
  async searchCourseBtn(@Ctx() ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, (ctx: Context) =>
      this.searchService.changeToSelectLanguage(ctx),
    );
  }

  @Action(/.*::select_search_lang/)
  async selectSearchLangBtn(@Ctx() ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, (ctx: Context) =>
      this.searchService.changeToCollectSearchData(ctx),
    );
  }
}
