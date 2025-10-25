export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  // when true, this movie was seeded as a local mock/example
  // and can be hidden or removed from the input when the user starts typing
  isMock?: boolean;
}

export interface MovieRecommendation {
  title:string;
  reason: string;
  match_reasons: string[];
  posterPath?: string | null;
  // when true, this recommendation was generated locally as a mock/example
  // and can be treated differently in the UI (e.g. hidden when user starts typing)
  isMock?: boolean;
}