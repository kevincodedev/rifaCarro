import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-count-down',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit, OnDestroy {
  private targetDate = new Date('2026-02-01T00:00:00');
  private timer: any;
  private ticketService = inject(TicketService);
  private ticketTimer: any;

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  totalTickets = signal(0);
  totalFacturas = signal(0);

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
    this.fetchTotalTickets();
    this.ticketTimer = setInterval(() => {
      this.fetchTotalTickets();
      //actualiza cada 1 minuto
    }, 1 * 60 * 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.ticketTimer) {
      clearInterval(this.ticketTimer);
    }
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      clearInterval(this.timer);
      return;
    }

    this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
  }

  fetchTotalTickets(): void {
    this.ticketService.getTotalTickets().subscribe(response => {
      if (response.success) {
        this.totalTickets.set(response.data.totalTickets);
        this.totalFacturas.set(response.data.totalFacturas);
      }
    });
  }
}
