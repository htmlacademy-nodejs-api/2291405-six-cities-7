import { Command } from './command.interface.js';
import { Commands } from '../../const.js';
import chalk from 'chalk';


export class HelpCommand implements Command {
  public getName(): string {
    return `--${Commands.help}`;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.green('cli.js --<command> [--arguments]')}
        Команды:
            ${chalk.yellow('--version')}:                   # выводит номер версии
            ${chalk.yellow('--help')}:                      # печатает этот текст
            ${chalk.yellow('--import <path>')}:             # импортирует данные из TSV
    `);
  }
}
