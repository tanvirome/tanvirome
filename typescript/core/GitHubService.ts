import { GitHubClient } from './GitHubClient';
import { GitHubUser } from '../models/GitHubUser';
import { GitHubUserResponse, RepositoryEdge } from '../interfaces/GitHubGraphQLResponse';

export class GitHubService {
  private client: GitHubClient;
  private userDetails: GitHubUserResponse | undefined;

  constructor(client: GitHubClient) {
    this.client = client;
  }

  async fetchAndSetUserDetails(): Promise<void> {
    const githubUserData = await this.client.fetchUserDetails();

    if (!githubUserData) {
      return;
    }

    this.userDetails = githubUserData;

    const forkedCount = githubUserData.repositories.edges.reduce(
      (acc: number, repo: RepositoryEdge) => acc + repo.node.forkCount,
      0,
    );

    const user = new GitHubUser(
      githubUserData.login,
      githubUserData.name,
      new Date(githubUserData.createdAt).toLocaleDateString(),
      githubUserData.pullRequests.totalCount,
      // githubUserData.contributionsCollection.totalCommitContributions,
      0,
      forkedCount,
      githubUserData.repositories.totalCount,
    );
  }
}
