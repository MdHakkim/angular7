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


const routes: Routes = [
  { path: '', component: ProjectComponent },
  { path: 'joinus', component: RegistrationComponent},
  { path: 'explore', component: ExploreComponent},
  { path: 'editProfile', component: ProfileComponent},
  { path: 'contactus', component: ContactusComponent},
  { path: 'privacy', component: PrivacyPolicyComponent},
  { path: 'terms', component: TermsConditionComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'ourstory', component: OurStoryComponent},
  { path: 'visionmission', component: VisionMissionComponent},
  { path: 'createPassword', component: NewPasswordComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
