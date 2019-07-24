import { Injectable } from '@angular/core';
import {of, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  getValues(value): Observable<string> {
    return of('result ' + value)
  }

}
