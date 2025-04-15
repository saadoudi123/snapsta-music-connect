
// Define the allowed search result types
export type SearchResultType = "user" | "music" | "post" | "channel";

// Define the interface for search results
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  image: string;
  url: string;
}

// Define the props interface for SearchBox
export interface SearchBoxProps {
  className?: string;
}
