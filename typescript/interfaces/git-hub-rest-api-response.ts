export interface GitHubRepoContributorActivityResponse {
  total: number;
  weeks: {
    w: number;
    a: number;
    d: number;
    c: number;
  }[];
  author: {
    login: string;
  };
}

export interface GitHubRepoViewTrafficResponse {
  count: number;
  uniques: number;
  views: {
    timestamp: string;
    count: number;
    uniques: number;
  }[];
}
