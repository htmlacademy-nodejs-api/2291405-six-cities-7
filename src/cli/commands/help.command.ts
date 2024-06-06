import { Commands } from '../types/command.enum.js';
import { Command } from './command.interface.js';
import chalk from 'chalk';


export class HelpCommand implements Command {
  public getName(): string {
    return Commands.help;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            ${chalk.green('cli.js --<command> [--arguments]')}
        Команды:
            ${chalk.yellow(Commands.version)}:                   # выводит номер версии
            ${chalk.yellow(Commands.help)}:                      # печатает этот текст
            ${chalk.yellow(`${Commands.import} <path>`)}:             # импортирует данные из TSV
            ${chalk.yellow(`${Commands.generate} <path>`)}:             # генерирует данные из TSV
    `);
  }
}
