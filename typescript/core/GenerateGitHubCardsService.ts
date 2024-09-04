import path from 'path';
import { GitHubService } from './GitHubService';
import { SVGProcessor } from './SVGProcessor';
import { TEMPLATE_STRINGS } from '../constants/template-strings.constant';
import { LANGUAGE_TEMPLATE } from '../constants/language-template.constant';

export class GenerateGitHubCardsService {
  constructor(private githubService: GitHubService) {}

  async generateCards(): Promise<void> {
    await this.generateGitHubStatsCard();
    await this.generateGitHubLanguagesCard();
  }

  private async generateGitHubStatsCard(): Promise<void> {
    const statsOverview = this.githubService.getGitHubStatsOverview();

    if (!statsOverview) {
      return;
    }

    console.log('Generating GitHub Stats Card...', statsOverview);

    const templateValues = {
      [TEMPLATE_STRINGS.NAME]: statsOverview.fullName || statsOverview.username,
      [TEMPLATE_STRINGS.STARS]: statsOverview.starsCount,
      [TEMPLATE_STRINGS.FORKS]: statsOverview.forkedCount,
      [TEMPLATE_STRINGS.CONTRIBUTIONS]: statsOverview.contributionCount,
      [TEMPLATE_STRINGS.LINES_CHANGED]: statsOverview.totalLinesChanged,
      [TEMPLATE_STRINGS.VIEWS]: statsOverview.totalReposViewsLastTwoWeek,
      [TEMPLATE_STRINGS.REPOS]: statsOverview.totalRepositories,
    };

    // Paths to the input SVG file and the output file
    const inputSVGPath = path.resolve(__dirname, '../../Images/github_stats_card_template.svg');
    const outputSVGPath = path.resolve(__dirname, '../../Images/github_stats_card.svg');

    const svgProcessor = new SVGProcessor();
    await svgProcessor.processSVG(inputSVGPath, outputSVGPath, templateValues);
  }

  private async generateGitHubLanguagesCard(): Promise<void> {
    // Paths to the input SVG file and the output file
    const inputSVGPath = path.resolve(__dirname, '../../Images/github_languages_card_template.svg');
    const outputSVGPath = path.resolve(__dirname, '../../Images/github_languages_card.svg');
    const languages = this.githubService.getLanguages();
    const animationDelay = 100;
    const svgProcessor = new SVGProcessor();
    let languageProgress = '';
    let languageList = '';

    if (!languages) {
      return;
    }

    console.log('Generating GitHub Languages Card...', languages);

    languages.forEach((language, index) => {
      const languageProgressTemplateValues = {
        [TEMPLATE_STRINGS.LANGUAGE_COLOR]: language.color,
        [TEMPLATE_STRINGS.LANGUAGE_PERCENTAGE]: language.usagePercentage.toFixed(2),
      };
      const languageListTemplateValues = {
        [TEMPLATE_STRINGS.LANGUAGE_COLOR]: language.color,
        [TEMPLATE_STRINGS.LANGUAGE_NAME]: language.name,
        [TEMPLATE_STRINGS.LANGUAGE_PERCENTAGE]: language.usagePercentage.toFixed(2),
        [TEMPLATE_STRINGS.ANIMATION_DELAY]: ((index + 1) * animationDelay).toString(),
      };

      languageProgress += svgProcessor.replaceTemplateStrings(
        LANGUAGE_TEMPLATE.PROGRESS,
        languageProgressTemplateValues,
      );
      languageList += svgProcessor.replaceTemplateStrings(LANGUAGE_TEMPLATE.LANGUAGE_LIST, languageListTemplateValues);
    });

    const templateValues = {
      [TEMPLATE_STRINGS.LANGUAGE_PROGRESS]: languageProgress,
      [TEMPLATE_STRINGS.LANGUAGE_LIST]: languageList,
    };

    await svgProcessor.processSVG(inputSVGPath, outputSVGPath, templateValues);
  }
}
