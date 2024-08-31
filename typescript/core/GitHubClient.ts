import axios from 'axios';
import { GitHubGraphQLResponse, GitHubUserResponse } from '../interfaces/GitHubGraphQLResponse';
import * as fs from 'fs';

export class GitHubClient {
  private readonly apiUrl: string = 'https://api.github.com/graphql';
  private readonly token: string;
  private readonly outputFilePath: string = './githubResponse.json';

  constructor(token: string) {
    this.token = token;
  }

  async fetchUserDetails(): Promise<GitHubUserResponse> {
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
            repositories(first: 100, isFork: false) {
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

    let response;

    try {
      response = await axios.post<GitHubGraphQLResponse>(
        this.apiUrl,
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
      console.error('Error fetching user details:', error);
    }

    return response?.data.data.viewer as GitHubUserResponse;
  }

  private saveResponseToFile(data: GitHubGraphQLResponse): void {
    fs.writeFileSync(this.outputFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Response data saved to ${this.outputFilePath}`);
  }
}
