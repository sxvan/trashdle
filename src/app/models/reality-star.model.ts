import { Show } from './show.model';

export interface RealityStar {
  name: string;
  alternative_names: string[];
  shows: Show[];
  catchphrase: string;
  gender: string;
  birthyear: number;
  instagram_followers: number;
  image_url: string;
}
