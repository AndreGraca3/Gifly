import { useCallback, useEffect, useReducer } from "react";
import { Gif } from "../domain/Gif";
import GifApi from "../api/GifApi";

type UseGifs = [gifs: Gif[], fetchAndSetGifs: () => void, hasMoreGifs: boolean];

type State = {
  gifs: Set<Gif>;
  page: number;
  hasMoreGifs: boolean;
};

type Action =
  | { type: "RESET" }
  | {
      type: "FETCH_SUCCESS";
      payload: { gifs: Gif[]; page: number; hasMore: boolean };
    }
  | { type: "FETCH_ERROR" };

export default function useGifs(gifApi: GifApi, query: string): UseGifs {
  // Define the initial state for the reducer
  const initialState: State = {
    gifs: new Set<Gif>(),
    page: 1,
    hasMoreGifs: false,
  };

  // Reducer function to handle state transitions
  const reducer = (state: State, action: Action) => {
    if (query.length === 0) return { ...initialState };

    switch (action.type) {
      case "RESET":
        return { ...initialState };
      case "FETCH_SUCCESS":
        return {
          gifs:
            action.payload.page == 1
              ? new Set(action.payload.gifs)
              : new Set([...state.gifs, ...action.payload.gifs]),
          page: state.page + 1,
          hasMoreGifs: action.payload.hasMore,
        };
      case "FETCH_ERROR":
        return { gifs: new Set<Gif>(), page: 1, hasMoreGifs: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch function using the current `query` and `page`
  const fetchAndSetGifs = useCallback(async () => {
    if (query.length == 0) {
      if (state.gifs.size > 0) {
        dispatch({ type: "RESET" });
      }
      return;
    }

    try {
      if (
        query.endsWith(".gif") ||
        query.endsWith(".webp") ||
        query.endsWith(".apng")
      ) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            gifs: [{ name: gifApi.urlToTitle(query), url: query, tags: [] }],
            page: 1,
            hasMore: false,
          },
        });
        return;
      }

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
  }, [state, query]);

  useEffect(() => {
    state.page = 1;
    fetchAndSetGifs();
  }, [query]);

  return [Array.from(state.gifs), fetchAndSetGifs, state.hasMoreGifs];
}
