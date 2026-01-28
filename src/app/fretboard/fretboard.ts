import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game, GameState } from '../game';

@Component({
  selector: 'app-fretboard',
  imports: [CommonModule],
  templateUrl: './fretboard.html',
  styleUrl: './fretboard.css',
})
export class Fretboard implements OnInit {
  gameState: GameState;
  strings = [0, 1, 2, 3, 4, 5];
  frets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  stringNames = ['E', 'B', 'G', 'D', 'A', 'E'];
  selectedPosition: { string: number; fret: number } | null = null;
  feedbackMessage = '';
  feedbackClass = '';
  showFeedback = false;

  constructor(public gameService: Game) {
    this.gameState = this.gameService.getGameState();
    console.log('Fretboard component constructed');
  }

  ngOnInit(): void {
    console.log('Fretboard ngOnInit called');
    this.startGame();
  }

  startGame(): void {
    console.log('Starting game...');
    this.gameState = this.gameService.startGame();
    console.log('Game state after start:', this.gameState);
    this.feedbackMessage = '';
    this.showFeedback = false;
  }

  onFretClick(string: number, fret: number): void {
    if (!this.gameState.isGameActive) return;

    console.log('Clicked:', { string, fret });
    console.log('Target:', this.gameState.targetNote);
    console.log('Note at position:', this.gameService.getNoteAtPosition(string, fret));

    this.selectedPosition = { string, fret };
    const correct = this.gameService.checkAnswer(string, fret);
    this.gameState = this.gameService.getGameState();

    if (correct) {
      this.feedbackMessage = '✓ Correct!';
      this.feedbackClass = 'correct';
    } else {
      const noteName = this.gameService.getNoteAtPosition(string, fret);
      this.feedbackMessage = `✗ Wrong! That was ${noteName}`;
      this.feedbackClass = 'incorrect';
    }

    this.showFeedback = true;
    setTimeout(() => {
      this.showFeedback = false;
      this.selectedPosition = null;
    }, 800);
  }

  isTargetPosition(string: number, fret: number): boolean {
    return false; // Don't show the target position
  }

  resetGame(): void {
    this.gameService.resetGame();
    this.gameState = this.gameService.getGameState();
    this.feedbackMessage = '';
    this.showFeedback = false;
  }

  getFretMarkerClass(fret: number): string {
    if ([3, 5, 7, 9].includes(fret)) return 'single-dot';
    if (fret === 12) return 'double-dot';
    return '';
  }

  getStringName(stringIndex: number | undefined): string {
    if (stringIndex === undefined) return '';
    return this.gameService.getStringName(stringIndex);
  }
}
