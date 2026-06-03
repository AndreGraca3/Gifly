import { Gif } from "../domain/Gif";

export default interface GifApi {
  search: (
    query: string,
    page: number,
    limit?: number
  ) => Promise<GifSearchResult>;

  urlToTitle: (url: string) => string;
}

export type GifSearchResult = {
  results: Gif[];
  hasMore: boolean;
};
