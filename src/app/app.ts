import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Fretboard } from './fretboard/fretboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Fretboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fretboard-game');
}
