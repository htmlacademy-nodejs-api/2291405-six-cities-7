import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import { Commands } from '../shared/helpers/const.js';
import chalk from 'chalk';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = `--${Commands.help}`
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    try {
      if (!this.commands[commandName]) {
        throw new Error(`"${commandName}" is not an internal command`);
      }
      return this.commands[commandName];
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
      return this.getDefaultCommand();
    }
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error(chalk.red(`The default command (${this.defaultCommand}) is not registered.`));
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
