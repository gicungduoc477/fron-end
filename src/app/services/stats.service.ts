import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsUpdated = new Subject<void>();
  statsUpdated$ = this.statsUpdated.asObservable();

  notifyStatsChanged(): void {
    this.statsUpdated.next();
  }
}
