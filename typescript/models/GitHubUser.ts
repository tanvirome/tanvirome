export class GitHubUser {
  constructor(
    public username: string,
    public fullName: string,
    public accountAge: string,
    public prCount: number,
    public commitCount: number,
    public forkedCount: number,
    public totalRepositories: number
  ) {}
}
