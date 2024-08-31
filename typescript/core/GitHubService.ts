import { IGitHubService } from '../interfaces/IGitHubService';
import { GitHubClient } from './GitHubClient';
import { GitHubUser } from '../models/GitHubUser';
import { GitHubGraphQLResponse, Repository, RepositoryEdge } from '../models/GitHubGraphQLResponse';

export class GitHubService implements IGitHubService {
  private client: GitHubClient;

  constructor(client: GitHubClient) {
    this.client = client;
  }

  async getUserDetails(): Promise<GitHubUser> {
    const githubUserData = await this.client.fetchUserDetails();

    console.log(githubUserData);

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

    return user;
  }
}
