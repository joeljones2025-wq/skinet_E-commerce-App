import { Service } from '@angular/core';

@Service()
export class Dialog {
  confirm(message: string, detail?: string): Promise<boolean> {
    return Promise.resolve(window.confirm(`${message}${detail ? `\n\n${detail}` : ''}`));
  }
}
