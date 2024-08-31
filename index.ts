import { GitHubService } from './typescript/core/GitHubService';
import { GitHubClient } from './typescript/core/GitHubClient';

(async () => {
  const token = process.env.GITHUB_TOKEN; // Set your token in environment variable

  if (!token) {
    throw new Error('GitHub Access Token is required');
  }

  const client = new GitHubClient(token);
  const service = new GitHubService(client);

  try {
    await service.fetchAndSetUserDetails();
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
})();
