import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/accounts.service';
import { SnackbarService } from '../../../core/services/snackbar';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/component/text-input/text-input";

@Component({
  selector: 'app-register',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatButton,
    TextInputComponent
],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationErrors = signal<string[]>([]);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.success('Registration successful - you can now login!');
        this.router.navigateByUrl('/account/login');
      },
      error: (err: unknown) => {
        if (Array.isArray(err)) {
          this.validationErrors.set(err.map(String));
          return;
        }

        if (err instanceof HttpErrorResponse && err.error?.errors) {
          this.validationErrors.set(Object.values(err.error.errors)
            .flatMap(messages => Array.isArray(messages) ? messages.map(String) : [String(messages)]));
          return;
        }

        this.validationErrors.set(['Registration failed. Please try again.']);
      }
    });
  }
}