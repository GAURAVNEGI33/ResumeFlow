import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService, AuthResponse } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.auth.login(this.loginForm.value).subscribe({
      next: (res: AuthResponse) => {
        if (res.success && res.data && res.data.token) {
          this.auth.saveToken(res.data.token);
          if (res.data.user) {
            this.auth.saveUser(res.data.user);
          }
          const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          const safeUrl = requestedUrl.startsWith('/') && !requestedUrl.startsWith('//')
            ? requestedUrl
            : '/dashboard';
          this.router.navigateByUrl(safeUrl);
        } else {
          this.error = res.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid email or password';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
