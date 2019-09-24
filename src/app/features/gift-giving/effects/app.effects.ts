import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pipe } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import * as appActions from '../../../actions/app.actions';
import * as sortFilterActions from '../actions/sort-filter.actions';
import * as holidayActions from '../actions/holidays.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HolidayEntity } from '../reducers/holidays.reducer';
@Injectable()
export class AppEffects {

  applicationStartedStuff$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.applicationStarted),
      map(() => sortFilterActions.loadSavedPrefs())
    ), { dispatch: true }
  );

  onAppStartLoadHolidays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.applicationStarted),
      switchMap(() => this.client.get<{ holidays: HolidayEntity[] }>(environment.holidayUrl)
        .pipe(
          map(response => response.holidays),
          map(holidays => holidayActions.loadDataSucceeded({ data: holidays }))
        )
      )
    ), { dispatch: true }
  );

  constructor(private actions$: Actions, private client: HttpClient) { }
}
