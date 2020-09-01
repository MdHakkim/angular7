import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ProjectComponent } from './project/project.component';
import { ExploreComponent } from './explore/explore.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { FaqComponent } from './faq/faq.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { VisionMissionComponent } from './vision-mission/vision-mission.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ShareDataService } from './share-data.service';

const routes: Routes = [
  { path: 'login', component: NewPasswordComponent },
  { path: 'generate_new_password/:id', component: NewPasswordComponent },
  { path: '', component: ProjectComponent, canActivate: [ShareDataService] },
  { path: 'joinus', component: RegistrationComponent, canActivate: [ShareDataService]},
  { path: 'explore', component: ExploreComponent, canActivate: [ShareDataService]},
  { path: 'editProfile', component: ProfileComponent},
  { path: 'contactus', component: ContactusComponent, canActivate: [ShareDataService]},
  { path: 'privacy', component: PrivacyPolicyComponent, canActivate: [ShareDataService]},
  { path: 'terms', component: TermsConditionComponent, canActivate: [ShareDataService]},
  { path: 'faq', component: FaqComponent, canActivate: [ShareDataService]},
  { path: 'ourstory', component: OurStoryComponent, canActivate: [ShareDataService]},
  { path: 'visionmission', component: VisionMissionComponent, canActivate: [ShareDataService]},
  { path: 'createPassword', component: NewPasswordComponent, canActivate: [ShareDataService]},
  { path: '**', redirectTo: '/', canActivate: [ShareDataService]}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
