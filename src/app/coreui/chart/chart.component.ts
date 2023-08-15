import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  chartOptions: {};
  @Input() title: string = "";
  @Input() subTitle: string = "";
  @Input() xTitle: string = "";
  @Input() yTitle: string = "";
  @Input() height: number = 400;

  @Input() type: string = "area";
  @Input() valueSuffix: string = ' ';

  @Input() data: any = [];
  @Input() xdata: any;
  @Input() xType: any = "datetime";
  @Input() showLabels: boolean = true;
  @Input() showCard: boolean = true;

  Highcharts = Highcharts;

  constructor() { }

  ngOnInit() {
    console.log("showLabels" + this.showLabels);
    console.log(this.showLabels);
  }

  ngAfterViewInit(): void {
    this.chartOptions = {
      chart: {
        height: this.height,
        type: this.type
      },
      title: {
        text: this.title
      },
      subtitle: {
        text: this.subTitle
      },
      tooltip: {
        split: true,
        valueSuffix: this.valueSuffix
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: this.showLabels,
      },
      legend: {
        enabled: this.showLabels,
      },
      series: this.data,
      plotOptions: {
        spline: {
          lineWidth: 4,
          states: {
            hover: {
              lineWidth: 5
            }
          },
          marker: {
            enabled: false
          },

          // pointInterval: 3600000, // one hour
          // pointStart: Date.UTC(2021, 1, 13, 0, 0, 0)
        },

        area: {
          //pointStart: 1940,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        },
        areaspline: {
          //pointStart: 1940,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      xAxis: {
        title: {
          enabled: this.xTitle != '',
          text: "Test"// this.xTitle
        },

        visible: this.showLabels,
        labels: {
          enabled: this.showLabels,
          format: '{value}'
        },
        type: this.xType,
        categories: this.xdata,
        accessibility: {
          description: 'Months of the year'
        },
        // accessibility: {
        //   rangeDescription: 'Range: 0 to 80 k.'
        // },
        maxPadding: 0.05,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: this.yTitle
        },
        visible: this.showLabels,
        labels: {
          enabled: this.showLabels,
          format: '{value}'
        },
        accessibility: {
          rangeDescription: 'Range: -90°C to 20°C.'
        },
        lineWidth: 2
      },
    };

    if (this.showLabels)
      HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 100);

  }

}
