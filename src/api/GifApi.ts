import { Gif } from "../domain/Gif";

export default interface GifApi {
  search: (
    query: string,
    limit?: number,
    position?: number | string
  ) => Promise<GifSearchResult>;

  urlToTitle: (url: string) => string;
}

export type GifSearchResult = {
  results: Gif[];
  nextPosition: number | string;
};
