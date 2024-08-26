'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { duolingoWords } from './duolingoWords';
import { jlpt5Words } from './jlpt5Words';

const wordLists = {
  "Duolingo": duolingoWords,
  "JLPT-5": jlpt5Words,
};

export default function JapaneseWords() {
  const [selectedList, setSelectedList] = useState<keyof typeof wordLists>("Duolingo");
  const [answers, setAnswers] = useState<{ [key: string]: string | null }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [randomizedWords, setRandomizedWords] = useState<typeof duolingoWords>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const shuffled = [...wordLists[selectedList]].sort(() => Math.random() - 0.5);
    setRandomizedWords(shuffled);
  }, [selectedList]);

  useEffect(() => {
    if (openDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelection = (english: string, romanji: string) => {
    setAnswers(prev => ({ ...prev, [english]: romanji }));
    setOpenDropdown(null);
    setSearchTerm("");
  };

  const toggleDropdown = useCallback((english: string) => {
    setOpenDropdown(prev => prev === english ? null : english);
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const checkAnswer = (english: string): string => {
    const correctRomanji = wordLists[selectedList].find(word => word.english === english)?.romanji;
    const userAnswer = answers[english];
    if (!userAnswer) return '';
    if (userAnswer.toLowerCase() === correctRomanji?.toLowerCase()) {
      return 'Correct!';
    } else {
      return `Incorrect. The correct answer is "${correctRomanji}".`;
    }
  };

  const filteredWords = (wordList: typeof duolingoWords) => {
    return [...wordList].filter(word =>
      word.romanji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.hiragana_katakana.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (word.kanji && word.kanji.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => a.romanji.localeCompare(b.romanji));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="wordList" className="mr-2">Select Word List:</label>
        <select
          id="wordList"
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value as keyof typeof wordLists)}
          className="border border-gray-300 rounded p-2"
        >
          {Object.keys(wordLists).map((list) => (
            <option key={list} value={list}>{list}</option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 w-1/5">English</th>
            <th className="border border-gray-300 p-2 w-2/5">Japanese</th>
            <th className="border border-gray-300 p-2 w-2/5">Result</th>
          </tr>
        </thead>
        <tbody>
          {randomizedWords.map((word) => (
            <tr key={word.english}>
              <td className="border border-gray-300 p-2">{word.english}</td>
              <td className="border border-gray-300 p-2">
                <div className="relative">
                  <button
                    className="w-full text-left bg-white border border-gray-300 p-2 rounded"
                    onClick={() => toggleDropdown(word.english)}
                  >
                    {answers[word.english] || "Select Japanese word"}
                  </button>
                  {openDropdown === word.english && (
                    <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-2 py-1 border-b border-gray-300"
                      />
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="px-2 py-1 font-semibold text-left w-1/4">Romanji</th>
                            <th className="px-2 py-1 font-semibold text-left w-1/4">Hiragana/Katakana</th>
                            <th className="px-2 py-1 font-semibold text-left w-1/4">Kanji</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredWords(wordLists[selectedList]).map((pair) => (
                            <tr
                              key={pair.romanji}
                              className="hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelection(word.english, pair.romanji)}
                            >
                              <td className="px-2 py-1">{pair.romanji}</td>
                              <td className="px-2 py-1">{pair.hiragana_katakana}</td>
                              <td className="px-2 py-1">{pair.kanji}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                {answers[word.english] && (
                  <span className={checkAnswer(word.english).startsWith('Correct') ? 'text-green-600' : 'text-red-600'}>
                    {checkAnswer(word.english)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}