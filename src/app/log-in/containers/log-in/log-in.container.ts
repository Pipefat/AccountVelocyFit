import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.container.html',
  styleUrls: ['./log-in.container.scss']
})
export class LogInContainer implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signIn(email: string): void {
    if (this.authService.isSigningIn) {
      this.authService.$signIn(email).subscribe({
        next: res => {
          if (res) {
            this.router.navigate(['/'])
          }
        }
      })
    } else {
      this.authService.$sendLinkToSingIn(email).subscribe({
        next: (res) => {
          if (res) {
            alert('Te hemos enviado un enlace a tu correo para ingresar, ¡gracias!');
          } else {
            alert('El correo ingresado no tiene acceso, revisa nuevamente.');
          }
        }
      })
    }
  }

}
