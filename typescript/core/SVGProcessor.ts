import { promises as fs, write } from 'fs';
import path from 'path';

export class SVGProcessor {
  async processSVG(inputPath: string, outputPath: string, templateValues: Record<string, string>): Promise<void> {
    try {
      // Read the SVG file
      const svgContent = await this.readFile(inputPath);

      // Replace template strings with actual values
      const processedContent = this.replaceTemplateStrings(svgContent, templateValues);

      // Write the modified SVG to the output path
      await this.writeFile(outputPath, processedContent);

      console.log(`SVG has been processed and saved to ${outputPath}`);
    } catch (error) {
      console.error('Error processing SVG: ', error);
    }
  }

  replaceTemplateStrings(content: string, templateValues: Record<string, string>): string {
    let processedContent = content;

    for (const [key, value] of Object.entries(templateValues)) {
      const templateString = `{{ ${key} }}`;
      processedContent = processedContent.replace(new RegExp(templateString, 'g'), value);
    }

    return processedContent;
  }

  private async readFile(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      return content;
    } catch (error) {
      console.error('Error reading file: ', error);

      throw error;
    }
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error('Error writing file: ', error);

      throw error;
    }
  }
}
