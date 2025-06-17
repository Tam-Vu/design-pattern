/**
 * Command interface that all concrete command classes must implement.
 */
export interface Command {
  execute(): Promise<any>;
}
