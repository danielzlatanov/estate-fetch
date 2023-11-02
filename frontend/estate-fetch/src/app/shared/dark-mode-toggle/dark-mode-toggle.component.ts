import { Component, OnInit } from '@angular/core';
import * as DarkReader from 'darkreader';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.css'],
})
export class DarkModeToggleComponent implements OnInit {
  isDarkModeEnabled!: boolean;

  ngOnInit() {
    this.isDarkModeEnabled =
      localStorage.getItem('isDarkModeEnabled') === 'true';

    if (this.isDarkModeEnabled) {
      DarkReader.enable({ brightness: 100, contrast: 90 });
    }
  }

  onToggleDarkMode() {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;
    localStorage.setItem(
      'isDarkModeEnabled',
      this.isDarkModeEnabled.toString()
    );

    if (this.isDarkModeEnabled) {
      this.isDarkModeEnabled = true;
      DarkReader.enable({ brightness: 100, contrast: 90 });
    } else {
      DarkReader.disable();
      this.isDarkModeEnabled = false;
    }
  }
}
