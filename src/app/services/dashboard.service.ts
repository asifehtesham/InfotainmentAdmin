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
      name: 'January',
      data: [32, 435, 509, 647, 702, 834, 968],
      }, {
      name: 'February',
      data: [2, 135, 209, 347, 402, 534, 668],
      }, {
      name: 'March',
      data: [132, 235, 409, 547, 602, 734, 868],
      }, {
      name: 'April',
      data: [7, 235, 309, 547, 602, 934, 968],
      }, {
      name: 'May',
      data: [5, 15, 39, 47, 102, 234, 568],
      }, {
      name: 'June',
      data: [12, 35, 109, 247, 302, 434, 668]
      }, {
      name: 'July',
      data: [15, 232, 345, 464, 575, 688, 797],
      }, {
      name: 'August',
      data: [22, 234, 323, 563, 676, 834, 928],
      }, {
      name: 'September',
      data: [9, 35, 109, 247, 302, 434, 618], 
      }, {
      name: 'October',
      data: [45,55, 65,75, 85, 95, 105],
      }, {
      name: 'November',
      data: [13, 25, 36, 66, 77, 122, 168],
      }, {
      name: 'December',
      data: [2, 35, 49, 57, 62, 74, 88],
    }];
  }

  cards() {
    return [71, 78, 39, 66];
  } 
  pieChart() {
    return [{
      name: 'January',
      y: 21.41,
      sliced: true,
      selected: true
      }, {
      name: 'February',
      y: 11.84
      }, {
      name: 'March',
      y: 10.85
      }, {
      name: 'April',
      y: 4.67
      }, {
      name: 'May',
      y: 4.18
      }, {
      name: 'June',
      y: 1.64
      }, {
      name: 'July',
      y: 1.6
      }, {
      name: 'August',
      y: 1.2
      }, {
      name: 'September',
      y: 2.61
      }, {
      name: 'October',
      y: 2.61
      }, {
      name: 'November',
      y: 2.61
      }, {
      name: 'December',
      y: 2.61
    }];
  }

  barChart() {
    return [ 15.41, 11.84,10.85 ,4.67, 4.18,  3.64,  5.6,8.2,9.6, 12.61
    ];
  }

  
}
