import axios from 'axios';
import {
  GitHubContributionsResponse,
  GitHubGraphQLContributionsResponse,
  GitHubGraphQLResponse,
  GitHubUserResponse,
} from '../interfaces/GitHubGraphQLResponse';
import {
  GitHubRepoContributorActivityResponse,
  GitHubRepoViewTrafficResponse,
} from '../interfaces/git-hub-rest-api-response';

export class GitHubClient {
  private readonly graphQLApiUrl: string = 'https://api.github.com/graphql';
  private readonly restApiUrl: string = 'https://api.github.com';
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async fetchUserDetails(): Promise<GitHubUserResponse | undefined> {
    const query = `
        query {
          viewer {
            login
            name
            createdAt
            contributionsCollection {
              contributionYears
            }
            followers {
              totalCount
            }
            gists {
              totalCount
            }
            isGitHubStar
            pullRequests {
              totalCount
            }
            repositories(affiliations: OWNER, first: 100, isFork: false) {
              totalCount
              totalDiskUsage
              edges {
                node {
                  id
                  name
                  nameWithOwner
                  createdAt
                  isFork
                  forkCount
                  isPrivate
                  languages(orderBy: {field: SIZE, direction: DESC}, first: 100) {
                    totalSize
                    totalCount
                    edges {
                      size
                      node {
                        id
                        name
                        color
                      }
                    }
                  }
                  stargazers {
                    totalCount
                  }
                }
              }
            }
            repositoriesContributedTo(
              first: 100
              contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY, PULL_REQUEST_REVIEW]
            ) {
              totalCount
              totalDiskUsage
              edges {
                node {
                  name
                  nameWithOwner
                  forkCount
                  stargazers {
                    totalCount
                  }
                  languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                    totalCount
                    totalSize
                    edges {
                      size
                      node {
                        id
                        name
                        color
                      }
                    }
                  }
                }
              }
            }
          }
        }
    `;
    const errorMessage = 'Error fetching user details: ';

    const response = await this.callGraphQLApi<GitHubGraphQLResponse>(query, errorMessage);

    return response?.data.viewer;
  }

  async fetchContributionsByYears(years: number[]): Promise<GitHubContributionsResponse | undefined> {
    const query = this.getContributionsByYearsQuery(years);
    const errorMessage = 'Error fetching contributions by years: ';

    const response = await this.callGraphQLApi<GitHubGraphQLContributionsResponse>(query, errorMessage);

    return response?.data.viewer;
  }

  async fetchRepoContributorActivity(
    owner: string,
    repo: string,
  ): Promise<GitHubRepoContributorActivityResponse[] | undefined> {
    const apiUrl = `${this.restApiUrl}/repos/${owner}/${repo}/stats/contributors`;
    const errorMessage = 'Error fetching repo contributor activity: ';

    return await this.callRestApi<GitHubRepoContributorActivityResponse[]>(apiUrl, errorMessage);
  }

  async fetchRepoViewTraffic(owner: string, repo: string): Promise<GitHubRepoViewTrafficResponse | undefined> {
    const apiUrl = `${this.restApiUrl}/repos/${owner}/${repo}/traffic/views`;
    const errorMessage = 'Error fetching repo view traffic: ';

    return await this.callRestApi<GitHubRepoViewTrafficResponse>(apiUrl, errorMessage);
  }

  private async callGraphQLApi<ResponseModel>(
    query: string,
    errorMessage: string = '',
  ): Promise<ResponseModel | undefined> {
    let response;

    try {
      response = await axios.post<ResponseModel>(
        this.graphQLApiUrl,
        {
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(errorMessage, error);
    }

    return response?.data;
  }

  private async callRestApi<ResponseModel>(
    apiUrl: string,
    errorMessage: string = '',
  ): Promise<ResponseModel | undefined> {
    let response;

    for (let i = 0; i < 5; i++) {
      try {
        response = await axios.get<ResponseModel>(apiUrl, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            Accept: 'application/vnd.github+json',
          },
        });

        if (response.status === 202) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        break;
      } catch (error) {
        console.error(`(${i}) ${errorMessage}`, error);
        continue;
      }
    }

    return response?.data;
  }

  private getContributionsByYearsQuery(years: number[]): string {
    const byYearsQuery = years
      .map(
        year => `
        __${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z") {
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
          totalRepositoryContributions
        }
      `,
      )
      .join('\n');

    return `
      query {
        viewer {
          ${byYearsQuery}
        }
      }
    `;
  }
}
