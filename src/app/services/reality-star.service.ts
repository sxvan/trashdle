import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RealityStar } from '../models/reality-star.model';
import { HttpClient } from '@angular/common/http';
import { GameMode } from '../models/games-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class RealityStarService {
  constructor(private http: HttpClient) {}

  getStars(): Observable<RealityStar[]> {
    return this.http.get<RealityStar[]>('assets/reality_stars.json');
  }

  getStarOfDay(gameMode: GameMode): Observable<RealityStar> {
    return this.getStars().pipe(
      map((stars) => {
        const now = new Date();
        const index = this.getStarIndex(now, gameMode, stars.length);
        return stars[index];
      })
    );
  }

  private getStarIndex(
    date: Date,
    offset: number,
    numberOfStars: number
  ): number {
    // Create a unique index based on the current date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const day = date.getDate();

    // Create a unique number using year, month, and day
    const uniqueDateNumber = year * 10000 + month * 100 + day + offset;

    // Use modulus to cycle through the stars
    return uniqueDateNumber % numberOfStars;
  }
}
