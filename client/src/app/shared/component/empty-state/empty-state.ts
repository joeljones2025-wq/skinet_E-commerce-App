import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BusyService } from '../../../core/services/busy';

@Component({
  imports: [MatIcon,],
  selector: 'app-empty-state',
  styleUrl: './empty-state.css',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  busyService = inject(BusyService);
  message = input.required<string>();
  icon = input.required<string>();
  actionText = input.required<string>()
  action = output<void>();

  onAction() {
    this.action.emit();
  }
}
