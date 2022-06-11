import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-enter-box',
  templateUrl: './enter-box.component.html',
  styleUrls: ['./enter-box.component.scss']
})
export class EnterBoxComponent implements OnInit {

  @Output() signIn: EventEmitter<string> = new EventEmitter<string>();

  public emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor() { }

  ngOnInit(): void {
  }

  proceedToLogIn(event: Event): void {
    if (this.emailControl.valid) {
      event.preventDefault();
      this.signIn.emit(this.emailControl.value)
    }
  }

}
