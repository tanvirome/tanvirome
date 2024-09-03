import { GenerateGitHubCardsService } from './typescript/core/GenerateGitHubCardsService';
import { GitHubService } from './typescript/core/GitHubService';
import { GitHubClient } from './typescript/core/GitHubClient';

(async () => {
  const token = process.env.ACCESS_TOKEN; // Set your token in environment variable

  if (!token) {
    throw new Error('GitHub Access Token is required');
  }

  const client = new GitHubClient(token);
  const gitHubService = new GitHubService(client);
  const generateGitHubCardService = new GenerateGitHubCardsService(gitHubService);

  try {
    await gitHubService.fetchAndSetUserDetails();

    await generateGitHubCardService.generateCards();
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
})();