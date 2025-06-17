import { Injectable } from '@nestjs/common';
import { Command } from './command.interface';

@Injectable()
export class CommandInvoker {
  private command: Command;

  setCommand(command: Command) {
    this.command = command;
    return this;
  }

  async executeCommand() {
    if (!this.command) {
      throw new Error('No command set');
    }
    return this.command.execute();
  }
}
