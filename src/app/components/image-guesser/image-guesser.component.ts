import { Component, OnInit, ViewChild } from '@angular/core';
import { RealityStar } from '../../models/reality-star.model';
import { RealityStarService } from '../../services/reality-star.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { GameMode } from '../../models/games-mode.enum';
import { ImageGameService } from '../../services/image-game.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

@Component({
  selector: 'app-image-guesser',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  templateUrl: './image-guesser.component.html',
  styleUrl: './image-guesser.component.css',
})
export class ImageGuesserComponent implements OnInit {
  answers$: Observable<RealityStar[]> = this.imageGameService.answers$;
  isCompleted$: Observable<boolean> = this.imageGameService.isCompleted$;
  starOfDay$: Observable<RealityStar> = this.starService.getStarOfDay(
    GameMode.image
  );

  autocompleteSource$: Observable<RealityStar[]> = of([]);
  isCompleted: boolean = false;

  @ViewChild(AutocompleteComponent)
  autocompleteComponent!: AutocompleteComponent<RealityStar>;

  constructor(
    private starService: RealityStarService,
    private imageGameService: ImageGameService
  ) {}

  ngOnInit(): void {
    this.isCompleted$.subscribe((value) => {
      this.isCompleted = value;
    });

    this.autocompleteSource$ = combineLatest([
      this.starService.getStars(),
      this.imageGameService.answers$,
    ]).pipe(
      map(([stars, answers]) => {
        return stars.filter(
          (star) => !answers.some((answer) => answer.name === star.name)
        );
      })
    );
  }

  getStarName(star: RealityStar): string {
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
    this.imageGameService.addAnswer(star);
    this.autocompleteComponent.setValue('');
  }

  onSubmit(value: string) {
    this.starService.getStars().subscribe((stars) => {
      const star = stars.find(
        (star) => star.name.toLowerCase() === value.toLowerCase()
      );
      if (star) {
        this.imageGameService.addAnswer(star);
        this.autocompleteComponent.setValue('');
      }
    });
  }

  getImageScale(answers: RealityStar[], isCompleted: boolean): number {
    const maxScale = 5;
    const minScale = 1;

    if (isCompleted === true) {
      return 1;
    }
    const answerCount = answers.length;
    return Math.max(maxScale - answerCount, minScale);
  }
}
