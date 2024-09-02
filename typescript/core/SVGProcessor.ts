import { promises as fs } from 'fs';
import path from 'path';

export class SVGProcessor {
  private templateValues: Record<string, string>;

  constructor(templateValues: Record<string, string>) {
    this.templateValues = templateValues;
  }

  async processSVG(inputPath: string, outputPath: string): Promise<void> {
    try {
      // Read the SVG file
      const svgContent = await fs.readFile(inputPath, 'utf-8');

      // Replace template strings with actual values
      let processedContent = svgContent;
      for (const [key, value] of Object.entries(this.templateValues)) {
        const templateString = `{{ ${key} }}`;
        processedContent = processedContent.replace(new RegExp(templateString, 'g'), value);
      }

      // Write the modified SVG to the output path
      await fs.writeFile(outputPath, processedContent, 'utf-8');
      console.log(`SVG has been processed and saved to ${outputPath}`);
    } catch (error) {
      console.error('Error processing SVG: ', error);
    }
  }
}
