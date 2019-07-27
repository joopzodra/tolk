import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorMessage = new BehaviorSubject<string>('');
  public errorMessageStream = this.errorMessage.asObservable();

  constructor() { }

  emitError(message: string) {
    this.errorMessage.next(message)
  }
}
