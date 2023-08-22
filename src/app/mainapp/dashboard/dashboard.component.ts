import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, empty, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { BlogService } from 'src/app/services/blog.service';
import { PagesService } from 'src/app/services/pages.service';
import { BranchService } from 'src/app/services/branch.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  bigChart = [];
  cards = [];
  pieChart = [];
  barChart = [];
  blogs:any=[] 
  branches:any=[] 
  barChannelsChart=[]
  pages:any=[] 
  
  ngOnInit() {
    this.bigChart = this.dashboardService.bigChart();
    this.cards = this.dashboardService.cards();
    this.pieChart = this.dashboardService.pieChart();
    this.barChart = this.dashboardService.barChart();
    this.barChannelsChart=this.dashboardService.barChannelsChart();
    
    // this.authenticationService.oauthcall().subscribe(x => {
    //   console.log(x)
    // });
    this.branchService.loadData().subscribe(results => {
      results.forEach(element => {
        this.branches.push(element);
      });
    });

    this.pageService.loadData().subscribe(results => {
      results.forEach(element => {
        this.pages.push(element);
      });
    });
    
  }

  constructor(private authenticationService: AuthService, private dashboardService: DashboardService,private blogService: BlogService, private branchService: BranchService,private pageService: PagesService) { } 
  
  blogsChart(blogId){

  }
  pageChart(pageId){

  }
}