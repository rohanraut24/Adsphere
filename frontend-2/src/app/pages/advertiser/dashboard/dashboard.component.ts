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
  selector: 'app-advertiser-dashboard',
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
  spend: number | null = null;
  campaigns: any[] = [];
  transactions: any[] = [];
  loading = true;

  upgradeRequests: any[] = [];
  showUpgradeModal = false;

  private api = inject(ApiService);

  get active(): number {
    return this.campaigns.filter(c => c.status === 'ACTIVE').length;
  }

  get pending(): number {
    return this.campaigns.filter(c => c.status === 'PENDING_APPROVAL').length;
  }

  get draft(): number {
    return this.campaigns.filter(c => c.status === 'DRAFT').length;
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
      spend: this.api.advertiser.getSpend(),
      campaigns: this.api.advertiser.getCampaigns(),
      transactions: this.api.advertiser.getTransactions()
    }).subscribe({
      next: (res) => {
        this.spend = res.spend;
        this.campaigns = res.campaigns;
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
