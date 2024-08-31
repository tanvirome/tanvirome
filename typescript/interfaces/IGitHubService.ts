import { GitHubUser } from '../models/GitHubUser';

export interface IGitHubService {
  getUserDetails(): Promise<GitHubUser>;
}
