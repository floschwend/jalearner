'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data structure (replace this with your actual data from the Excel file)
const wordPairs = [
  { english: 'hello', japanese: 'konnichiwa' },
  { english: 'goodbye', japanese: 'sayonara' },
  { english: 'thank you', japanese: 'arigatou' },
  { english: 'yes', japanese: 'hai' },
  { english: 'no', japanese: 'iie' },
  // Add more word pairs here
];

export default function JapaneseWords() {
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>(
    Object.fromEntries(wordPairs.map(pair => [pair.english, '']))
  );
  const [messages, setMessages] = useState<{ [key: string]: string }>(
    Object.fromEntries(wordPairs.map(pair => [pair.english, '']))
  );

  const checkAnswer = (english: string, answer: string) => {
    const correctJapanese = wordPairs.find(word => word.english === english)?.japanese;
    if (answer.toLowerCase() === correctJapanese?.toLowerCase()) {
      setMessages(prev => ({ ...prev, [english]: 'Correct!' }));
    } else {
      setMessages(prev => ({ ...prev, [english]: `Incorrect. The correct answer is "${correctJapanese}".` }));
    }
  };

  const handleInputChange = (english: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [english]: value }));
    checkAnswer(english, value);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>English</TableHead>
              <TableHead>Japanese</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wordPairs.map((word) => (
              <TableRow key={word.english}>
                <TableCell>{word.english}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => handleInputChange(word.english, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Japanese word" />
                    </SelectTrigger>
                    <SelectContent>
                      {wordPairs.map((pair) => (
                        <SelectItem key={pair.japanese} value={pair.japanese}>
                          {pair.japanese}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {messages[word.english] && (
                    <span className={messages[word.english].startsWith('Correct') ? 'text-green-600' : 'text-red-600'}>
                      {messages[word.english]}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}