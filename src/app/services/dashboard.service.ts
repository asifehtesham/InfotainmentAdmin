import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private authenticationService: AuthService) { }



  profileViews() {
    return [{
      name: 'Views',
      data: [
        ['Jan', 1.7],
        ['Feb', 2.7],
        ['Mar', 3.7],
        ['Apr', 4.7],
        ['May', 5],
        ['June', 6],
      ]
    }]
  }
  overallRating() {
    return [{
      name: 'Views',
      data: [
        ['Jan', 1.7],
        ['Feb', 2.7],
        ['Mar', 3.7],
        ['Apr', 4.7],
        ['May', 5],
        ['June', 6],
      ]
    }]
  }

  courseOverviews() {
    return [{
      name: 'Angular Foundation',
      data: [
        [1167609600000, 3.7
        ],
        [1170892800000, 6.4
        ],
        [1173398400000, 3.3
        ],
        [1175644800000, 6.1
        ],
      ]
    },
    {
      name: 'Microservices',
      data: [
        [1167609600000, 2.7
        ],
        [1170892800000, 8.4
        ],
        [1173398400000, 5.3
        ],
        [1175644800000, 2.1
        ],
      ]
    },
    {
      name: 'Kubernatives',
      data: [
        [1167609600000, 6.7
        ],
        [1170892800000, 2.4
        ],
        [1173398400000, 6.3
        ],
        [1175644800000, 6.1
        ],
      ]
    }]
  }

  teacherRevenue() {
    return [{
      name: 'Revenue',
      data: [
        [1167609600000, 3.7
        ],
        [1170892800000, 6.4
        ],
        [1173398400000, 3.3
        ],
        [1175644800000, 6.1
        ],

      ]
      // data: [
      //   ['Jan', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['Feb', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['Mar', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['Apr', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['May', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['Jun', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      //   ['Jul', [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4]
      //   ],
      // ]
      // data: [3.7, 3.3, 3.9, 5.1, 3.5, 3.8, 4.0, 5.0, 6.1, 3.7, 3.3, 6.4,
      //   6.9, 6.0, 6.8, 4.4, 4.0, 3.8, 5.0, 4.9, 9.2, 9.6, 9.5, 6.3,
      //   9.5, 10.8, 14.0, 11.5, 10.0, 10.2, 10.3, 9.4, 8.9, 10.6, 10.5, 11.1,
      //   10.4, 10.7, 11.3, 10.2, 9.6, 10.2, 11.1, 10.8, 13.0, 12.5, 12.5, 11.3,
      //   10.1]
    }];
  }

  bigChart() {
    return [{
      name: 'Asia',
      data: [502, 635, 809, 947, 1402, 3634, 5268]
    }, {
      name: 'Africa',
      data: [106, 107, 111, 133, 221, 767, 1766]
    }, {
      name: 'Europe',
      data: [163, 203, 276, 408, 547, 729, 628]
    }, {
      name: 'America',
      data: [18, 31, 54, 156, 339, 818, 1201]
    }, {
      name: 'Oceania',
      data: [2, 2, 2, 6, 13, 30, 46]
    }];
  }

  cards() {
    return [71, 78, 39, 66];
  }

  pieChart() {
    return [{
      name: 'Chrome',
      y: 61.41,
      sliced: true,
      selected: true
    }, {
      name: 'Internet Explorer',
      y: 11.84
    }, {
      name: 'Firefox',
      y: 10.85
    }, {
      name: 'Edge',
      y: 4.67
    }, {
      name: 'Safari',
      y: 4.18
    }, {
      name: 'Sogou Explorer',
      y: 1.64
    }, {
      name: 'Opera',
      y: 1.6
    }, {
      name: 'QQ',
      y: 1.2
    }, {
      name: 'Other',
      y: 2.61
    }];
  }
}
