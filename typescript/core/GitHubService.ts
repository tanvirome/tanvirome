import { GitHubClient } from './GitHubClient';
import {
  GitHubUserResponse,
  LanguageConnection,
  LanguageEdge,
  Repository,
  RepositoryEdge,
} from '../interfaces/GitHubGraphQLResponse';
import { GitHubStatDto } from '../interfaces/git-hub-stats-dto';
import { GitHubLanguageDto } from '../interfaces/git-hub-language-dto';

export class GitHubService {
  private client: GitHubClient;
  private userDetails: GitHubUserResponse | undefined;
  private languagesDict: { [key: string]: GitHubLanguageDto } = {};
  private totalStarsCount = 0;
  private totalForksCount = 0;
  private totalCommitContributions = 0;
  private totalPullRequestContributions = 0;
  private totalPullRequestReviewContributions = 0;
  private totalIssueContributions = 0;
  private totalRepositoryContributions = 0;
  private totalContributionsCount = 0;
  private totalLinesAdded = 0;
  private totalLinesDeleted = 0;
  private totalLinesChanged = 0;
  private totalOwnedRepos = 0;
  private totalContributedRepos = 0;
  private totalReposViewsLastTwoWeek = 0;

  constructor(client: GitHubClient) {
    this.client = client;
  }

  async fetchAndSetUserDetails(): Promise<void> {
    const githubUserData = await this.client.fetchUserDetails();

    if (!githubUserData) {
      return;
    }

    this.userDetails = githubUserData;

    await this.processGraphQLResponse();
  }

  getGitHubStatsOverview(): GitHubStatDto {
    const userDetails = this.userDetails;

    if (!userDetails) {
      throw new Error('User details are not fetched yet');
    }

    const accountAgeInMs = new Date().getTime() - new Date(userDetails.createdAt).getTime();
    const accountAge = Math.floor(accountAgeInMs / (1000 * 60 * 60 * 24 * 365)).toString();

    return {
      username: userDetails.login,
      fullName: userDetails.name || userDetails.login,
      starsCount: this.totalStarsCount.toString(),
      forkedCount: this.totalForksCount.toString(),
      contributionCount: this.totalContributionsCount.toString(),
      totalLinesChanged: this.totalLinesChanged.toString(),
      totalRepositories: (this.totalOwnedRepos + this.totalContributedRepos).toString(),
      totalReposViewsLastTwoWeek: this.totalReposViewsLastTwoWeek.toString(),
      accountAge: accountAge,
      prCount: userDetails.pullRequests.totalCount.toString(),
      commitCount: this.totalCommitContributions.toString(),
    };
  }

  getLanguages(): GitHubLanguageDto[] {
    return Object.values(this.languagesDict).sort((a, b) => b.size - a.size);
  }

  private async processGraphQLResponse(): Promise<void> {
    await this.getAndSetTotalContributions();

    const contributedRepos = this.userDetails?.repositoriesContributedTo.edges || [];
    const ownedRepos = this.userDetails?.repositories.edges || [];
    const repositories = contributedRepos.concat(ownedRepos);

    this.totalOwnedRepos = ownedRepos.length;
    this.totalContributedRepos = contributedRepos.length;

    await Promise.all(
      repositories.map(async repo =>
        Promise.all([this.getAndSetLinesChangedInformation(repo.node), this.getAndSetRepoViewTraffic(repo.node)]),
      ),
    );

    repositories.forEach(repo => {
      this.totalStarsCount += repo.node.stargazers.totalCount || 0;
      this.totalForksCount += repo.node.forkCount || 0;

      this.setLanguagesProgressOfRepo(repo.node.languages);
    });

    this.setLanguagesUsagePercentage();
  }

  private setLanguagesProgressOfRepo(languages: LanguageConnection): void {
    languages.edges.forEach(languageEdge => {
      const language = languageEdge.node.name || 'Other';
      const languageColor = languageEdge.node.color;
      const languageSize = languageEdge.size || 0;

      if (this.languagesDict[language]) {
        this.languagesDict[language].size += languageSize;
        this.languagesDict[language].occurrences += 1;
      } else {
        this.languagesDict[language] = {
          name: language,
          color: languageColor,
          size: languageSize,
          occurrences: 1,
          usagePercentage: 0,
        };
      }
    });
  }

  private setLanguagesUsagePercentage(): void {
    const totalLanguagesSize = Object.values(this.languagesDict).reduce((acc, language) => acc + language.size, 0);

    Object.values(this.languagesDict).forEach(language => {
      language.usagePercentage = (language.size / totalLanguagesSize) * 100;
    });
  }

  private async getAndSetTotalContributions(): Promise<void> {
    const contributedYears = this.userDetails?.contributionsCollection.contributionYears || [];
    const contributions = await this.client.fetchContributionsByYears(contributedYears);

    if (!contributions) {
      return;
    }

    contributedYears.forEach(year => {
      const contribution = contributions[`__${year}`];

      this.totalCommitContributions += contribution.totalCommitContributions || 0;
      this.totalPullRequestContributions += contribution.totalPullRequestContributions || 0;
      this.totalPullRequestReviewContributions += contribution.totalPullRequestReviewContributions || 0;
      this.totalIssueContributions += contribution.totalIssueContributions || 0;
      this.totalRepositoryContributions += contribution.totalRepositoryContributions || 0;
      this.totalContributionsCount =
        this.totalCommitContributions +
        this.totalPullRequestContributions +
        this.totalPullRequestReviewContributions +
        this.totalIssueContributions +
        this.totalRepositoryContributions;
    });
  }

  private async getAndSetLinesChangedInformation(repo: Repository): Promise<void> {
    const repoContributorActivity = await this.client.fetchRepoContributorActivity(
      this.userDetails?.login || 'tanvirome',
      repo.name,
    );

    if (!repoContributorActivity) {
      return;
    }

    const userContributorActivity = repoContributorActivity.find(
      contributor => contributor.author.login === this.userDetails?.login,
    );

    if (!userContributorActivity) {
      return;
    }

    this.totalLinesAdded += userContributorActivity.weeks.reduce((acc, week) => acc + week.a, 0);
    this.totalLinesDeleted += userContributorActivity.weeks.reduce((acc, week) => acc + week.d, 0);
    this.totalLinesChanged = this.totalLinesAdded + this.totalLinesDeleted;
  }

  private async getAndSetRepoViewTraffic(repo: Repository): Promise<void> {
    const repoViewTraffic = await this.client.fetchRepoViewTraffic(this.userDetails?.login || 'tanvirome', repo.name);

    if (!repoViewTraffic) {
      return;
    }

    this.totalReposViewsLastTwoWeek += repoViewTraffic.count;
  }
}
