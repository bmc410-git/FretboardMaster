import { Injectable } from '@angular/core';

export interface Note {
  name: string;
  string: number;
  fret: number;
}

export interface GameState {
  score: number;
  lives: number;
  streak: number;
  targetNote: Note | null;
  isGameActive: boolean;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class Game {
  private notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Standard tuning - matches stringNames order: E (high), B, G, D, A, E (low)
  private openStrings = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E (indices in notes array)
  private stringNames = ['E (high)', 'B', 'G', 'D', 'A', 'E (low)'];

  getStringName(stringIndex: number): string {
    return this.stringNames[stringIndex] || '';
  }
  
  private gameState: GameState = {
    score: 0,
    lives: 3,
    streak: 0,
    targetNote: null,
    isGameActive: false,
    level: 1
  };

  constructor() { }

  startGame(): GameState {
    this.gameState = {
      score: 0,
      lives: 3,
      streak: 0,
      targetNote: this.generateRandomNote(),
      isGameActive: true,
      level: 1
    };
    return this.gameState;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  generateRandomNote(): Note {
    const maxFret = Math.min(12, 5 + this.gameState.level);
    const string = Math.floor(Math.random() * 6);
    const fret = Math.floor(Math.random() * (maxFret + 1)); // Include 0 (open string)
    const noteIndex = (this.openStrings[string] + fret) % 12;
    
    return {
      name: this.notes[noteIndex],
      string,
      fret
    };
  }

  checkAnswer(selectedString: number, selectedFret: number): boolean {
    if (!this.gameState.targetNote || !this.gameState.isGameActive) {
      return false;
    }

    // Only check if correct string and fret
    const correct = 
      selectedString === this.gameState.targetNote.string &&
      selectedFret === this.gameState.targetNote.fret;

    if (correct) {
      this.gameState.score += (10 + this.gameState.streak * 5);
      this.gameState.streak++;
      if (this.gameState.streak % 5 === 0) {
        this.gameState.level = Math.min(12, this.gameState.level + 1);
      }
      this.gameState.targetNote = this.generateRandomNote();
    } else {
      this.gameState.lives--;
      this.gameState.streak = 0;
      if (this.gameState.lives <= 0) {
        this.gameState.isGameActive = false;
      }
    }

    return correct;
  }

  getNoteAtPosition(string: number, fret: number): string {
    const noteIndex = (this.openStrings[string] + fret) % 12;
    return this.notes[noteIndex];
  }

  resetGame(): void {
    this.startGame();
  }
}
