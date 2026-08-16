import { Component } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  submitted = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';

  submit(): void {
    this.submitted = true;
    if (this.newPassword.length < 8) {
      this.message = 'Use at least 8 characters for the new password.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'The new passwords do not match.';
      return;
    }
    this.message = 'The form is ready. The secure change-password endpoint will be connected in the backend phase.';
  }
}
