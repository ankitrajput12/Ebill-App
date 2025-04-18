import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { SuccessfulPageComponent } from './components/successful-page/successful-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { authGuard } from '../app/shared/guards/auth.guard';


export const routes: Routes = [

    {
        path:'',component:HomeComponent
    }
    ,
    {
        path:'admin',component:LoginPageComponent
    },
    { path: 'eventdetails', component: EventDetailsComponent },
    { path: 'registrationpage/:id', component: RegistrationPageComponent },
    {
        path:'success',component:SuccessfulPageComponent
    },
    {
        path:'adminpage',component:AdminPageComponent,canActivate:[authGuard]
    },{
        path:'**',redirectTo:'/',pathMatch:'full'
    }

];
