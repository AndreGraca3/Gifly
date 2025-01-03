import { useCallback, useEffect, useReducer } from "react";
import { Gif } from "../domain/Gif";
import GifApi from "../api/GifApi";

type UseGifs = [gifs: Gif[], fetchAndSetGifs: () => void, hasMoreGifs: boolean];

type State = {
  gifs: Set<Gif>;
  position: string | number | null;
};

type Action =
  | { type: "RESET" }
  | {
      type: "FETCH_SUCCESS";
      payload: { gifs: Gif[]; nextPosition: string | number | null };
    }
  | { type: "FETCH_ERROR" };

export default function useGifs(gifApi: GifApi, query: string): UseGifs {
  // Define the initial state for the reducer
  const initialState: State = {
    gifs: new Set<Gif>(),
    position: null,
  };

  // Reducer function to handle state transitions
  const reducer = (state: State, action: Action) => {
    if(query.length === 0) return { ...initialState };

    switch (action.type) {
      case "RESET":
        return { ...initialState };
      case "FETCH_SUCCESS":
        return {
          gifs:
            state.position == null
              ? action.payload.gifs
              : [...state.gifs, ...action.payload.gifs],
          position: action.payload.nextPosition,
        };
      case "FETCH_ERROR":
        return { ...state, gifs: new Set<Gif>(), position: null };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch function using the current `query` and `position`
  const fetchAndSetGifs = useCallback(async () => {
    if (query.length == 0) {
      dispatch({ type: "RESET" });
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
            nextPosition: null,
          },
        });
        return;
      }

      const gifsResponse = await gifApi.search(query, 20, state.position);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          gifs: gifsResponse.results,
          nextPosition: gifsResponse.nextPosition,
        },
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: "FETCH_ERROR" });
    }
  }, [state, query]);

  useEffect(() => {
    state.position = null;
    fetchAndSetGifs();
  }, [query]);

  return [Array.from(state.gifs), fetchAndSetGifs, state.position != null];
}
