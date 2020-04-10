import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ProjectComponent } from './project/project.component';
import { ExploreComponent } from './explore/explore.component';

const routes: Routes = [
  { path: '', component: ProjectComponent }, //
  { path: 'joinus', component: RegistrationComponent},
  { path: 'explore', component: ExploreComponent},
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
