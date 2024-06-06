import chalk from 'chalk';
import got from 'got';

import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { Commands } from '../types/command.enum.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return Commands.generate;
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      if (!parameters.length) {
        throw new Error('Not enough parameters error');
      }

      const [count, filepath, url] = parameters;
      const offerCount = Number(count);

      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.green(`File ${filepath} was created!`));

    } catch (error) {
      console.error(chalk.red('Can\'t generate data'));

      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(error.message));
    }
  }
}
