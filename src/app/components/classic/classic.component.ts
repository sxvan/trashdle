import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RealityStar } from '../../models/reality-star.model';
import { RealityStarService } from '../../services/reality-star.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Show } from '../../models/show.model';
import { ClassicGameService } from '../../services/classic-game.service';
import { combineLatest, map, Observable, of } from 'rxjs';
import { GameMode } from '../../models/games-mode.enum';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

@Component({
  selector: 'app-classic',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './classic.component.html',
  styleUrl: './classic.component.css',
})
export class ClassicComponent implements OnInit {
  answer: string = '';
  answers$: Observable<RealityStar[]> = this.classicGameService.answers$;
  isCompleted$: Observable<boolean> = this.classicGameService.isCompleted$;
  starOfDay$: Observable<RealityStar> = this.starService.getStarOfDay(
    GameMode.classic
  );

  showAutocompleteResults = false;

  @ViewChild(AutocompleteComponent)
  autocompleteComponent!: AutocompleteComponent<RealityStar>;

  autocompleteSource$: Observable<RealityStar[]> = of([]);
  autocompleteStars: RealityStar[] = [];

  isAutoFit = false;

  constructor(
    private starService: RealityStarService,
    private classicGameService: ClassicGameService
  ) {}

  ngOnInit(): void {
    this.autocompleteSource$ = combineLatest([
      this.starService.getStars(),
      this.classicGameService.answers$,
    ]).pipe(
      map(([stars, answers]) => {
        return stars.filter(
          (star) => !answers.some((answer) => answer.name === star.name)
        );
      })
    );
  }

  getStarName(star: RealityStar) {
    return star.name;
  }

  filterStars(source: RealityStar[], value: string) {
    if (value === '') {
      return source;
    }

    return source.filter(
      (star) =>
        star.name.toLowerCase().includes(value.toLowerCase()) ||
        star.alternative_names.some((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        )
    );
  }

  onItemSelected(star: RealityStar) {
    this.classicGameService.addAnswer(star);
    this.autocompleteComponent.setValue('');
  }

  onSubmit(value: string) {
    this.starService.getStars().subscribe((stars) => {
      const star = stars.find(
        (star) => star.name.toLowerCase() === value.toLowerCase()
      );
      if (star) {
        this.classicGameService.addAnswer(star);
        this.autocompleteComponent.setValue('');
      }
    });
  }

  getNameClass(name: string, starOfDay: RealityStar): string {
    if (name === starOfDay.name) {
      return 'correct';
    }

    return 'incorrect';
  }

  getGenderClass(gender: string, starOfDay: RealityStar): string {
    if (gender === starOfDay.gender) {
      return 'correct';
    }

    return 'incorrect';
  }

  getShowsClass(shows: Show[], starOfDay: RealityStar): string {
    if (
      shows
        .map((show) => show.name)
        .sort()
        .join() ===
      starOfDay.shows
        .map((show) => show.name)
        .sort()
        .join()
    ) {
      return 'correct';
    }
    if (
      shows
        .map((show) => show.name)
        .some((showName) =>
          starOfDay.shows.map((show) => show.name).includes(showName)
        )
    ) {
      return 'partially-correct';
    }

    return 'incorrect';
  }

  getBirthyearClass(birthyear: number, starOfDay: RealityStar): string {
    if (birthyear === starOfDay.birthyear) {
      return 'correct';
    }

    if (birthyear > starOfDay.birthyear) {
      return 'incorrect lower';
    }

    return 'incorrect higher';
  }

  getFollowersClass(followers: number, starOfDay: RealityStar): string {
    if (followers === starOfDay.instagram_followers) {
      return 'correct';
    }

    if (followers > starOfDay.instagram_followers) {
      return 'incorrect lower';
    }

    return 'incorrect higher';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest(
      '.autocomplete'
    );
    if (!clickedInside) {
      this.showAutocompleteResults = false;
    }
  }
}
