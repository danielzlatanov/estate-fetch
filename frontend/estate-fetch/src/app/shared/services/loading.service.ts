import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading = false;
  private _isSearching = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get isSearching(): boolean {
    return this._isSearching;
  }

  set isSearching(value: boolean) {
    this._isSearching = value;
  }
}
