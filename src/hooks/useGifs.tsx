import { useCallback, useEffect, useReducer, useState } from "react";
import { Gif } from "../domain/Gif";
import GifApi from "../api/GifApi";

type UseGifs = [gifs: Gif[], fetchAndSetGifs: () => void, hasMoreGifs: boolean];

type State = {
  gifs: Set<Gif>;
  position: string | number | null;
  hasMoreGifs: boolean;
};

export default function useGifs(gifApi: GifApi, query: string): UseGifs {
  // Define the initial state for the reducer
  const initialState: State = {
    gifs: new Set(),
    position: null,
    hasMoreGifs: true,
  };

  // Reducer function to handle state transitions
  const reducer = (state: State, action: any) => {
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
          hasMoreGifs: action.payload.nextPosition != null,
        };
      case "FETCH_ERROR":
        return { ...state, gifs: [] };
      default:
        return state;
    }
  };

  // Use reducer to manage the state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch function using the current `query` and `position`
  const fetchAndSetGifs = useCallback(async () => {
    try {
      if (
        query.endsWith(".gif") ||
        query.endsWith(".webp") ||
        query.endsWith(".apng")
      ) {
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            gifs: [{ name: "", url: query, tags: [] }],
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
      dispatch({ type: "FETCH_ERROR" });
    }
  }, [state.position, query]);

  // Reset state when query changes
  useEffect(() => {
    dispatch({ type: "RESET" });
    fetchAndSetGifs();
  }, [query]);

  // Return the state and fetch function
  return [Array.from(state.gifs), fetchAndSetGifs, state.hasMoreGifs];
}
