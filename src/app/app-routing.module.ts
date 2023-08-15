import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { AuthGuard } from './services/Authguard';

const routes: Routes = [
  {
    path: 'mainapp',
    loadChildren: () => import('../app/mainapp/mainapp.module').then(m => m.MainappModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'mainapp/main',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: 'mainapp/main' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
