'use client';

import React, { useState, useEffect } from 'react';
import { duolingoWords } from '../dashboard/duolingoWords';
import { jlpt5Words } from '../dashboard/jlpt5Words';
import WordCard from '../components/wordCard';

const wordLists = {
  "Duolingo": duolingoWords,
  "JLPT-5": jlpt5Words,
};

type WordList = keyof typeof wordLists;

export default function FlashcardsDashboard() {
  const [selectedList, setSelectedList] = useState<WordList>("Duolingo");
  const [randomizedWords, setRandomizedWords] = useState<typeof duolingoWords>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setRandomizedWords([...wordLists[selectedList]].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }, [selectedList]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : randomizedWords.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < randomizedWords.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="p-4 space-y-4">
      <select 
        value={selectedList} 
        onChange={(e) => setSelectedList(e.target.value as WordList)}
        className="border p-2 rounded"
      >
        {Object.keys(wordLists).map((list) => (
          <option key={list} value={list}>{list}</option>
        ))}
      </select>

      <div>Debug: Selected List: {selectedList}, Current Index: {currentIndex}</div>

      {randomizedWords.length > 0 ? (
        <div className="flex items-center justify-center space-x-8">
          <button
            onClick={handlePrevious}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Previous
          </button>
          <WordCard word={randomizedWords[currentIndex]} />
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      ) : (
        <div>No words available</div>
      )}
    </div>
  );
}
