'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { duolingoWords } from './duolingoWords';
import { jlpt5Words } from './jlpt5Words';

const wordLists = {
  "Duolingo": duolingoWords,
  "JLPT-5": jlpt5Words,
};

type WordList = keyof typeof wordLists;

export default function JapaneseWords() {
  const [selectedList, setSelectedList] = useState<WordList>("Duolingo");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [randomizedWords, setRandomizedWords] = useState<typeof duolingoWords>([]);

  useEffect(() => {
    setRandomizedWords([...wordLists[selectedList]].sort(() => Math.random() - 0.5));
  }, [selectedList]);

  const handleAnswerChange = useCallback((english: string, value: string) => {
    setAnswers(prev => ({ ...prev, [english]: value }));
  }, []);

  const checkAnswer = useCallback((english: string): string => {
    const correctRomanji = wordLists[selectedList].find(word => word.english === english)?.romanji;
    const userAnswer = answers[english];
    if (!userAnswer) return '';
    if (userAnswer.toLowerCase() === correctRomanji?.toLowerCase()) {
      return 'Correct!';
    } else {
      return `Incorrect. The correct answer is "${correctRomanji}".`;
    }
  }, [selectedList, answers]);

  const handleClearAnswers = useCallback(() => {
    setAnswers({});
  }, []);

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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">English</th>
              <th className="border p-2">Japanese (Romanji)</th>
              <th className="border p-2">Hiragana/Katakana</th>
              <th className="border p-2">Kanji</th>
              <th className="border p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {randomizedWords.map((word) => (
              <tr key={word.english}>
                <td className="border p-2">
                  <div className="max-w-full overflow-hidden text-ellipsis">{word.english}</div>
                </td>
                <td className="border p-2">
                  <input
                    list={`options-${word.english}`}
                    type="text"
                    value={answers[word.english] || ""}
                    onChange={(e) => handleAnswerChange(word.english, e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder="Type or select Japanese word"
                  />
                  <datalist id={`options-${word.english}`}>
                    {wordLists[selectedList].map((option) => (
                      <option key={option.romanji} value={option.romanji} />
                    ))}
                  </datalist>
                </td>
                <td className="border p-2">
                  <div className="max-w-full overflow-hidden text-ellipsis">
                    {answers[word.english] && wordLists[selectedList].find(w => w.romanji.toLowerCase() === answers[word.english].toLowerCase())?.hiragana_katakana}
                  </div>
                </td>
                <td className="border p-2">
                  <div className="max-w-full overflow-hidden text-ellipsis">
                    {answers[word.english] && wordLists[selectedList].find(w => w.romanji.toLowerCase() === answers[word.english].toLowerCase())?.kanji}
                  </div>
                </td>
                <td className="border p-2">
                  <div className="max-w-full overflow-hidden text-ellipsis">
                    {answers[word.english] && (
                      <span className={checkAnswer(word.english).startsWith('Correct') ? 'text-green-600' : 'text-red-600'}>
                        {checkAnswer(word.english)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        onClick={handleClearAnswers}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Clear All Answers
      </button>
    </div>
  );
}