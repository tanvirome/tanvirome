export interface GitHubGraphQLResponse {
  data: {
    viewer: GitHubUserResponse;
  };
}

export interface GitHubUserResponse {
  login: string;
  name: string;
  createdAt: string;
  contributionsCollection: ContributionsCollection;
  followers: TotalCount;
  gist: TotalCount;
  isGitHubStar: boolean;
  pullRequests: TotalCount;
  repositories: RepositoryConnection;
  repositoriesContributedTo: RepositoryConnection;
}

export interface ContributionsCollection {
  contributionYears: number[];
}

export interface TotalCount {
  totalCount: number;
}

export interface RepositoryConnection extends TotalCount {
  totalDiskUsage: number;
  edges: RepositoryEdge[];
}

export interface RepositoryEdge {
  node: Repository;
}

export interface Repository {
  id: string;
  name: string;
  nameWithOwner: string;
  createdAt: string;
  isFork: boolean;
  forkCount: number;
  isPrivate: boolean;
  languages: LanguageConnection;
  stargazers: TotalCount;
}

export interface LanguageConnection extends TotalCount {
  totalSize: number;
  edges: LanguageEdge[];
}

export interface LanguageEdge {
  size: number;
  node: Language;
}

export interface Language {
  id: string;
  name: string;
  color: string;
}
