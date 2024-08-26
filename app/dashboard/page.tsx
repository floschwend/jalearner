'use client';

import React, { useState, useEffect } from 'react';
import { duolingoWords } from './duolingoWords';
import { jlpt5Words } from './jlpt5Words';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
    const shuffled = [...wordLists[selectedList]].sort(() => Math.random() - 0.5);
    setRandomizedWords(shuffled);
  }, [selectedList]);

  const handleAnswerChange = (english: string, value: string) => {
    setAnswers(prev => ({ ...prev, [english]: value }));
  };

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

  return (
    <div className="p-4 space-y-4">
      <Select onValueChange={(value: WordList) => setSelectedList(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select word list" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(wordLists).map((list) => (
            <SelectItem key={list} value={list}>{list}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>English</TableHead>
            <TableHead>Japanese</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {randomizedWords.map((word) => (
            <TableRow key={word.english}>
              <TableCell>{word.english}</TableCell>
              <TableCell>
                <Input
                  placeholder="Type Japanese word"
                  value={answers[word.english] || ""}
                  onChange={(e) => handleAnswerChange(word.english, e.target.value)}
                />
              </TableCell>
              <TableCell>
                {answers[word.english] && (
                  <span className={checkAnswer(word.english).startsWith('Correct') ? 'text-green-600' : 'text-red-600'}>
                    {checkAnswer(word.english)}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => setAnswers({})}>Clear All Answers</Button>
    </div>
  );
}