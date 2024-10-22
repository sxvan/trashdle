import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { GameMode } from '../models/games-mode.enum';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserAnswersService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setUserAnswers(gameMode: GameMode, answers: string[]): void {
    if (!isPlatformBrowser) {
      return;
    }

    const currentDate = this.getLocalDateString();
    const data = {
      date: currentDate,
      answers: answers,
    };
    localStorage.setItem(this.getKey(gameMode), JSON.stringify(data));
  }

  getUserAnswers(gameMode: GameMode): string[] {
    if (!isPlatformBrowser) {
      return [];
    }

    const data = localStorage.getItem(this.getKey(gameMode));
    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);
    const storedDate = parsedData.date;

    if (storedDate !== this.getLocalDateString()) {
      this.clearUserAnswers(gameMode);
      return [];
    }

    return parsedData.answers;
  }

  private clearUserAnswers(gameMode: GameMode): void {
    if (!isPlatformBrowser) {
      return;
    }

    localStorage.removeItem(this.getKey(gameMode));
  }

  private getLocalDateString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0'); // Day of the month

    return `${year}-${month}-${day}`;
  }

  private getKey(gameMode: GameMode): string {
    if (gameMode === GameMode.classic) {
      return 'classic_answers';
    }

    if (gameMode === GameMode.image) {
      return 'image_answers';
    }

    return '';
  }
}
