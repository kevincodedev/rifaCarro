import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './email-sent.component.html',
  styleUrl: './email-sent.component.css'
})
export class EmailSentComponent {

}
