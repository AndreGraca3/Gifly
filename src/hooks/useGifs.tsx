import { useCallback, useEffect, useReducer } from "react";
import { Gif } from "../domain/Gif";
import GifApi from "../api/GifApi";

type UseGifs = [
  gifs: Gif[],
  fetchAndSetGifs: () => void,
  hasMoreGifs: boolean,
  isError: boolean,
];

type State = {
  gifs: Set<Gif>;
  page: number;
  hasMoreGifs: boolean;
  isError: boolean;
};

type Action =
  | { type: "RESET" }
  | {
      type: "FETCH_SUCCESS";
      payload: { gifs: Gif[]; page: number; hasMore: boolean };
    }
  | { type: "FETCH_ERROR" };

export default function useGifs(gifApi: GifApi, query: string): UseGifs {
  const initialState: State = {
    gifs: new Set<Gif>(),
    page: 1,
    hasMoreGifs: false,
    isError: false,
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "RESET":
        return { ...initialState };
      case "FETCH_SUCCESS":
        return {
          gifs:
            action.payload.page === 1
              ? new Set(action.payload.gifs)
              : new Set([...state.gifs, ...action.payload.gifs]),
          page: state.page + 1,
          hasMoreGifs: action.payload.hasMore,
          isError: false,
        };
      case "FETCH_ERROR":
        return { gifs: new Set<Gif>(), page: 1, hasMoreGifs: false, isError: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Used for pagination (infinite scroll) — fetches the next page
  const fetchAndSetGifs = useCallback(async () => {
    if (query.length === 0) return;

    try {
      const gifsResponse = await gifApi.search(query, state.page, 20);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          gifs: gifsResponse.results,
          page: state.page,
          hasMore: gifsResponse.hasMore,
        },
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "FETCH_ERROR" });
    }
  }, [state.page, query]);

  // When the query changes, reset results and fetch page 1 fresh
  useEffect(() => {
    dispatch({ type: "RESET" });

    if (query.length === 0) return;

    let cancelled = false;

    const fetchFirstPage = async () => {
      try {
        if (
          query.endsWith(".gif") ||
          query.endsWith(".webp") ||
          query.endsWith(".apng")
        ) {
          if (!cancelled) {
            dispatch({
              type: "FETCH_SUCCESS",
              payload: {
                gifs: [{ name: gifApi.urlToTitle(query), url: query, tags: [] }],
                page: 1,
                hasMore: false,
              },
            });
          }
          return;
        }

        const gifsResponse = await gifApi.search(query, 1, 20);
        if (!cancelled) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              gifs: gifsResponse.results,
              page: 1,
              hasMore: gifsResponse.hasMore,
            },
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          dispatch({ type: "FETCH_ERROR" });
        }
      }
    };

    fetchFirstPage();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return [Array.from(state.gifs), fetchAndSetGifs, state.hasMoreGifs, state.isError];
}
