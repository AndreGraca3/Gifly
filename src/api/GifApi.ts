import { Gif } from "../domain/Gif";

export default interface GifApi {
  search: (
    query: string,
    limit?: number,
    position?: number | string
  ) => Promise<GifSearchResult>;
}

export type GifSearchResult = {
  results: Gif[];
  nextPosition: number | string;
};
