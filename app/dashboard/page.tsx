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

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>, english: string) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const options = filteredWords(wordLists[selectedList]);
      const currentIndex = options.findIndex(word => word.romanji === answers[english]);
      const newIndex = event.key === 'ArrowDown'
        ? (currentIndex + 1) % options.length
        : (currentIndex - 1 + options.length) % options.length;
      handleSelection(english, options[newIndex].romanji);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (openDropdown === english) {
        const firstOption = filteredWords(wordLists[selectedList])[0];
        if (firstOption) {
          handleSelection(english, firstOption.romanji);
        }
      } else {
        toggleDropdown(english);
      }
    } else if (event.key === 'Escape') {
      setOpenDropdown(null);
      setSearchTerm("");
    }
  }, [selectedList, answers, handleSelection, toggleDropdown, openDropdown]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, english: string) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (!openDropdown) {
      toggleDropdown(english);
    }
    // Update the answer immediately with the typed value
    setAnswers(prev => ({ ...prev, [english]: newValue }));
  }, [openDropdown, toggleDropdown]);

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
                  <div
                    className="w-full text-left bg-white border border-gray-300 p-2 rounded flex items-center"
                    onClick={() => toggleDropdown(word.english)}
                    onKeyDown={(e) => handleKeyDown(e, word.english)}
                    tabIndex={0}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={openDropdown === word.english}
                    aria-controls={`dropdown-${word.english}`}
                  >
                    <input
                      type="text"
                      className="flex-grow outline-none"
                      placeholder="Select or type Japanese word"
                      value={openDropdown === word.english ? searchTerm : (answers[word.english] || "")}
                      onChange={(e) => handleInputChange(e, word.english)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!openDropdown) {
                          toggleDropdown(word.english);
                        }
                      }}
                    />
                    <span className="ml-2">▼</span>
                  </div>
                  {openDropdown === word.english && (
                    <div 
                      id={`dropdown-${word.english}`}
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
                      role="listbox"
                    >
                      <div className="grid grid-cols-3 gap-2 p-2 text-sm">
                        <div className="font-semibold">Romanji</div>
                        <div className="font-semibold">Hiragana/Katakana</div>
                        <div className="font-semibold">Kanji</div>
                        {filteredWords(wordLists[selectedList]).map((pair) => (
                          <React.Fragment key={pair.romanji}>
                            <div
                              className="cursor-pointer hover:bg-gray-100 p-1"
                              onClick={() => handleSelection(word.english, pair.romanji)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSelection(word.english, pair.romanji);
                                }
                              }}
                              role="option"
                              aria-selected={answers[word.english] === pair.romanji}
                              tabIndex={0}
                            >
                              {pair.romanji}
                            </div>
                            <div className="p-1">{pair.hiragana_katakana}</div>
                            <div className="p-1">{pair.kanji}</div>
                          </React.Fragment>
                        ))}
                      </div>
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