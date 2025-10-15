import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title:'Home' },
      { path: 'about', component: AboutComponent, title: 'about' },
       {path:'book/:id',component:BookDetailComponent,title: 'Book Detail'},
        { path: 'signIn', component: SigninComponent, title: 'signin' },
    { path: 'signup', component: SignupComponent, title: 'signup' },
    
];
