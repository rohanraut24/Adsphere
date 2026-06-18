import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LucideDynamicIcon } from '@lucide/angular';
import { ApiService } from '../../../core/services/api.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { UpgradeRequestModalComponent } from '../../../shared/components/upgrade-modal/upgrade-modal.component';

@Component({
  selector: 'app-publisher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideDynamicIcon,
    StatCardComponent,
    BadgeComponent,
    UpgradeRequestModalComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  earnings: number | null = null;
  websites: any[] = [];
  transactions: any[] = [];
  loading = true;

  upgradeRequests: any[] = [];
  showUpgradeModal = false;

  private api = inject(ApiService);

  get approved(): number {
    return this.websites.filter(w => w.status === 'APPROVED').length;
  }

  get pending(): number {
    return this.websites.filter(w => w.status === 'PENDING').length;
  }

  get hasPendingUpgrade(): boolean {
    return this.upgradeRequests.some(r => r.status === 'PENDING');
  }

  ngOnInit() {
    this.loadData();
    this.loadUpgradeRequests();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      earnings: this.api.publisher.getEarnings(),
      websites: this.api.publisher.getWebsites(),
      transactions: this.api.publisher.getTransactions()
    }).subscribe({
      next: (res) => {
        this.earnings = res.earnings;
        this.websites = res.websites;
        this.transactions = res.transactions;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadUpgradeRequests() {
    this.api.publisher.getUpgradeRequests().subscribe({
      next: (res) => {
        this.upgradeRequests = res;
      },
      error: () => {}
    });
  }
}
