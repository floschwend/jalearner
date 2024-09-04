import React, { useState } from 'react';

interface Word {
  english: string;
  romanji: string;
  hiragana_katakana: string;
  kanji: string;
}

interface WordCardProps {
  word: Word;
}

export default function WordCard({ word }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-64 h-96 border border-gray-300 rounded-lg shadow-lg cursor-pointer"
      onClick={handleFlip}
    >
      {isFlipped ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-100">
          <span className="text-xl mb-2">{word.romanji}</span>
          <span className="text-xl mb-2">{word.hiragana_katakana}</span>
          <span className="text-2xl font-bold">{word.kanji}</span>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-4 bg-green-100">
          <span className="text-2xl font-bold">{word.english}</span>
        </div>
      )}
    </div>
  );
}
