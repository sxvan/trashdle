import { Routes } from '@angular/router';
import { ImageGuesserComponent } from './components/image-guesser/image-guesser.component';
import { ClassicComponent } from './components/classic/classic.component';

export const routes: Routes = [
  { path: '', component: ClassicComponent },
  { path: 'image', component: ImageGuesserComponent },
];
