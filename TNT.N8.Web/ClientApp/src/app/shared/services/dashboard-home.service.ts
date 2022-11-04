
import { map } from 'rxjs/operators';
import { Injectable, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { start } from 'repl';

@Pipe({ name: 'DashboardHomeService' })
export class DashboardHomeService {

  constructor(private httpClient: HttpClient) { }

  getDataDashboardHome(pieCharDate) {
    let url = localStorage.getItem('ApiEndPoint') + "/api/employee/getDataDashboardHome";
    return this.httpClient.post(url, {
      PieCharDate: pieCharDate
    }).pipe(
      map((response: Response) => {
        return response;
      }));
  }

  updateCustomerMeeting(customerMeetingId: string, startDate: Date, endDate: Date, userId: string) {
    let url = localStorage.getItem('ApiEndPoint') + "/api/customerCare/updateCustomerMeeting";
    return this.httpClient.post(url, {
      CustomerMeetingId: customerMeetingId,
      StartDate: startDate,
      EndDate: endDate,
      UserId : userId,
    }).pipe(
      map((response: Response) => {
        return response;
      }));
  }

  dashboardHomeViewDetail(Type,Month ) {
    let url = localStorage.getItem('ApiEndPoint') + "/api/employee/dashboardHomeViewDetail";
    return this.httpClient.post(url, {
      Type: Type,
      Month: Month
    }).pipe(
      map((response: Response) => {
        return response;
      }));
  }

}
