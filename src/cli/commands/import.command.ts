import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Commands } from '../../shared/helpers/const.js';
import chalk from 'chalk';
import { Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {

  private onImportedOffer(offer: Offer): void {
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public getName(): string {
    return Commands.import;
  }

  public async execute(...parameters: string[]): Promise<void> {
    try {
      if (!parameters.length) {
        throw new Error('Not enough parameters error');
      }
      const [filename] = parameters;
      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on('line', this.onImportedOffer);
      fileReader.on('end', this.onCompleteImport);

      fileReader.read();
    } catch (error) {

      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(chalk.red(error.message));
    }
  }
}
