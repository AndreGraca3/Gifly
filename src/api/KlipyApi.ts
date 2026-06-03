import GifApi, { GifSearchResult } from "./GifApi";

enum ResultSize {
  EXTRA_SMALL = "xs",
  SMALL = "sm",
  MEDIUM = "md",
  HD = "hd",
}

export default class KlipyApi implements GifApi {
  constructor(apiKey: string) {
    this.API_KEY = apiKey;
  }

  private API_KEY: string;

  async search(query: string, page = 1, limit = 10): Promise<GifSearchResult> {
    if (!query) {
      return { results: [], hasMore: false };
    }

    if (limit > 50) {
      throw new Error("Kiply's search limit cannot be greater than 50");
    }

    const resultData = await (window as any).api.safeFetch(
      `https://api.klipy.com/api/v1/${this.API_KEY}/gifs/search?page=${page}&per_page=${limit}&q=${query}&format_filter=gif`
    );

    var gifs = resultData.data.data.map((gifItem: any) => ({
      name: gifItem.title,
      url: gifItem.file[ResultSize.MEDIUM].gif.url,
      tags: gifItem.tags.map((tag: string) => tag.toLowerCase()),
    }));

    return {
      results: gifs,
      hasMore: resultData.data.has_next,
    };
  }

  urlToTitle(url: string): string {
    const rawTitle = url.split("/").pop();

    if (!rawTitle) {
      return "";
    }

    return rawTitle.split(".")[0];
  }
}
