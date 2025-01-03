import GifApi, { GifSearchResult } from "./GifApi";

enum MediaFilter {
  DEFAULT = "default",
  MINIMAL = "minimal",
  BASIC = "basic",
}

enum DefaultFormats {
  MEDIUMGIF = "mediumgif",
}

enum BasicFormats {
  NANOMP4 = "nanomp4",
  TINYGIF = "tinygif",
  TINYMP4 = "tinymp4",
  GIF = "gif",
  MP4 = "mp4",
  NANOGIF = "nanogif",
}

enum MinimalFormats {
  TINYGIF = "tinygif",
  GIF = "gif",
  MP4 = "mp4",
}

export default class TenorApi implements GifApi {
  constructor(
    apiKey: string,
    mediaFilter?: MediaFilter,
    formatToReturn?: BasicFormats | MinimalFormats
  ) {
    this.API_KEY = apiKey;

    if (mediaFilter) {
      this.mediaFilter = mediaFilter;
    }

    if (formatToReturn) {
      this.formatToReturn = formatToReturn;
    }
  }

  private API_KEY: string;

  // formats to use
  private mediaFilter = MediaFilter.DEFAULT;
  private formatToReturn: MinimalFormats | BasicFormats | DefaultFormats = DefaultFormats.MEDIUMGIF;

  async search(query: string, limit = 10, position?: string | number): Promise<GifSearchResult> {
    if (!query) {
      return { results: [], nextPosition: null };
    }

    if (limit > 50) {
      throw new Error("Tenor's search limit cannot be greater than 50");
    }

    const data = await (window as any).api.safeFetch(
      `https://tenor.googleapis.com/v2/search?q=${query}&key=${this.API_KEY}&media_filter=${this.mediaFilter}&limit=${limit}${position ? `&pos=${position}` : ""}`
    );

    var gifs = data.results.map((gifItem: any) => ({
      name: this.urlToTitle(gifItem.media_formats[this.formatToReturn].url),
      url: gifItem.media_formats[this.formatToReturn].url,
      tags: gifItem.tags.map((tag: string) => tag.toLowerCase()),
    }));

    return { results: gifs, nextPosition: data.next != 0 ? data.next : null };
  }

  urlToTitle(url: string): string {
    const rawTitle = url.split("/").pop();

    if (!rawTitle) {
      return "";
    }

    return rawTitle.split(".")[0];
  }
}
