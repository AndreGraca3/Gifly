export type Category = {
  label: string;
  emoji: string;
  query: string;
};

export const CATEGORIES: Category[] = [
  { label: "Trending", emoji: "🔥", query: "trending" },
  { label: "Reactions", emoji: "😂", query: "reaction" },
  { label: "Memes", emoji: "🤣", query: "meme" },
  { label: "Funny", emoji: "😄", query: "funny" },
  { label: "Animals", emoji: "🐶", query: "animals" },
  { label: "Dance", emoji: "💃", query: "dance" },
  { label: "Love", emoji: "❤️", query: "love" },
  { label: "Gaming", emoji: "🎮", query: "gaming" },
  { label: "Sports", emoji: "⚽", query: "sports" },
  { label: "Food", emoji: "🍕", query: "food" },
  { label: "Celebrate", emoji: "🎉", query: "celebrate" },
  { label: "Sad", emoji: "😢", query: "sad" },
];
