import path from 'path';
import { GitHubService } from './GitHubService';
import { SVGProcessor } from './SVGProcessor';
import { TEMPLATE_STRINGS } from '../constants/template-sttrings.constant';

export class GenerateGitHubCardsService {
  constructor(private githubService: GitHubService) {}

  async generateCards(): Promise<void> {
    await this.generateGitHubStatsCard();
  }

  private async generateGitHubStatsCard(): Promise<void> {
    const statsOverview = this.githubService.getGitHubStatsOverview();

    if (!statsOverview) {
      return;
    }

    console.log('Generating GitHub Stats Card...', statsOverview);

    const templateValues = {
      [TEMPLATE_STRINGS.NAME]: statsOverview.fullName || '',
      [TEMPLATE_STRINGS.STARS]: statsOverview.starsCount,
      [TEMPLATE_STRINGS.FORKS]: statsOverview.forkedCount,
      [TEMPLATE_STRINGS.CONTRIBUTIONS]: statsOverview.contributionCount,
      [TEMPLATE_STRINGS.LINES_CHANGED]: statsOverview.totalLinesChanged,
      [TEMPLATE_STRINGS.VIEWS]: statsOverview.totalReposViewsLastTwoWeek,
      [TEMPLATE_STRINGS.REPOS]: statsOverview.totalRepositories,
    };

    // Paths to the input SVG file and the output file
    const inputSVGPath = path.resolve(__dirname, '../../images/github_stats_card_template.svg');
    const outputSVGPath = path.resolve(__dirname, '../../images/github_stats_card.svg');

    const svgProcessor = new SVGProcessor(templateValues);
    await svgProcessor.processSVG(inputSVGPath, outputSVGPath);
  }
}
