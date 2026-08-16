import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      const email = this.forgotForm.value.email;

      this.auth.forgotPassword(email).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            // Pass the email to the reset password component
            this.router.navigate(['/auth/reset-password'], { queryParams: { email: email } });
          } else {
            this.error = res.message || 'Failed to send OTP';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error?.message || 'Failed to send OTP. Please try again.';
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
