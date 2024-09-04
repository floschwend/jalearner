import React from 'react';

interface Word {
  english: string;
  romanji: string;
  hiragana_katakana: string;
  kanji: string;
}

interface WordCardProps {
  word: Word;
  showEnglish: boolean;
  onFlip: () => void;
}

export default function WordCard({ word, showEnglish, onFlip }: WordCardProps) {
  return (
    <div 
      className="w-64 h-96 border border-gray-300 rounded-lg shadow-lg cursor-pointer flex items-center justify-center"
      onClick={onFlip}
    >
      {showEnglish ? (
        <span className="text-2xl font-bold">{word.english}</span>
      ) : (
        <div className="text-center">
          <p className="text-xl mb-2">{word.romanji}</p>
          <p className="text-xl mb-2">{word.hiragana_katakana}</p>
          <p className="text-2xl font-bold">{word.kanji}</p>
        </div>
      )}
    </div>
  );
}
