import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Commands } from '../../const.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return `--${Commands.import}`;
  }

  public execute(...parameters: string[]): void {
    try {
      if (!parameters.length) {
        throw new Error('Not enough parameters error');
      }
      const [filename] = parameters;
      const fileReader = new TSVFileReader(filename.trim());

      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {

      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(error.message));
    }
  }
}
