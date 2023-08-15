import { Component, OnInit } from '@angular/core';
import { catchError, empty, map, Observable } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-card-announcement',
  templateUrl: './card-announcement.component.html',
  styleUrls: ['./card-announcement.component.scss']
})
export class CardAnnouncementComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  //Announcements: Observable<Announcement[]>;
  ngOnInit(): void {
    this.loadData()
  }

  onRefresh() {
    this.loadData();
  }

  loadData() {
    // this.Announcements = this.dashboardService.getAccouncements()
    //   .pipe(
    //     map((results => {
    //       console.log("getAccouncements comp: ");
    //       console.log(results);
    //       return results;
    //     })),
    //     catchError((error) => {
    //       return empty();
    //     })
    //   );
  }
}
