
import {map} from 'rxjs/operators';
import { Pipe, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PermissionModel } from '../models/permission.model';
import { MenuBuild } from '../../admin/models/menu-build.model';

@Pipe({ name: 'PermissionService' })
@Injectable()
export class PermissionService {

  constructor(private httpClient: HttpClient) { }

  createRoleAndPermission(roleValue: string, roleDescription: string, listActionResource: Array<string>, listMenuBuild: Array<MenuBuild>) 
  {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/createRoleAndPermission';
    return this.httpClient.post(url, { 
            RoleValue: roleValue,
            Description: roleDescription, 
            ListActionResource: listActionResource,
            ListMenuBuild: listMenuBuild
           }).pipe(
            map((response: Response) => 
            {
              return response;
            }));
  }

  getAllRole() {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/getAllRole';
    return this.httpClient.post(url, {}).pipe(
      map((response: Response) => {
        return response;
      }));
  }

  getCreatePermission() {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/getCreatePermission';
    return this.httpClient.post(url, { }).pipe(
    map((response: Response) => {
      return response;
    }));
  }

  getDetailPermission(roleId: string) {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/getDetailPermission';
    return this.httpClient.post(url, { RoleId: roleId }).pipe(
    map((response: Response) => {
      return response;
    }));
  }

  editRoleAndPermission(roleId: string, roleValue: string, roleDescription: string, listActionResource: Array<string>, listMenuBuild: Array<MenuBuild>) 
  {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/editRoleAndPermission';
    return this.httpClient.post(url, { 
            RoleId: roleId,
            RoleValue: roleValue,
            Description: roleDescription, 
            ListActionResource: listActionResource,
            ListMenuBuild: listMenuBuild
           }).pipe(
            map((response: Response) => 
            {
              return response;
            }));
  }

  addUserRole(employeeId: string, roleId: string, userId: string) {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/addUserRole';
    return this.httpClient.post(url, { EmployeeId: employeeId, RoleId: roleId, UserId: userId }).pipe(
    map((response: Response) => {
      return response;
    }));
  }

  deleteRole(roleId: string, userId: string) {
    let url = localStorage.getItem('ApiEndPoint') + '/api/auth/deleteRole';
    return this.httpClient.post(url, { RoleId: roleId, UserId: userId }).pipe(
    map((response: Response) => {
      return response;
    }));
  }
}
