import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Observable, tap } from 'rxjs';
import { RealityStar } from '../models/reality-star.model';
import { GameMode } from '../models/games-mode.enum';
import { RealityStarService } from './reality-star.service';
import { UserAnswersService } from './user-answers.service';

@Injectable({
  providedIn: 'root',
})
export class ImageGameService {
  private isCompleted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private answers: BehaviorSubject<RealityStar[]> = new BehaviorSubject<
    RealityStar[]
  >([]);

  isCompleted$: Observable<boolean> = this.isCompleted.asObservable();
  answers$: Observable<RealityStar[]> = this.answers;
  starOfDay$: Observable<RealityStar> = this.starService.getStarOfDay(
    GameMode.image
  );

  constructor(
    private starService: RealityStarService,
    private userAnswersService: UserAnswersService
  ) {
    this.updateAnswers();
    this.updateCompleted();
    this.loadAnswers();
  }

  addAnswer(star: RealityStar) {
    const currentAnswers = [...this.answers.value, star];
    this.answers.next(currentAnswers);
  }

  private loadAnswers() {
    this.starService.getStars().subscribe((stars) => {
      const answers: RealityStar[] = this.userAnswersService
        .getUserAnswers(GameMode.image)
        .map((starName) => stars.find((star) => star.name === starName))
        .filter((star): star is RealityStar => star !== undefined);
      this.answers.next(answers);
    });
  }

  private updateCompleted() {
    combineLatest([this.starOfDay$, this.answers$])
      .pipe(
        tap(([starOfDay, answers]) => {
          const completed = answers.some(
            (answer) => answer.name === starOfDay.name
          );
          this.isCompleted.next(completed);
        })
      )
      .subscribe();
  }

  private updateAnswers() {
    this.answers$
      .pipe(
        filter((answers) => answers.length > 0),
        tap((answers) => {
          this.userAnswersService.setUserAnswers(
            GameMode.image,
            answers.map((star) => star.name)
          );
        })
      )
      .subscribe();
  }
}
