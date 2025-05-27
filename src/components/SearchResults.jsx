import React from 'react';
import { Card } from './ui/Card';

export function SearchResults({ results, onWordSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result, index) => (
        <Card 
          key={`${result.word}-${index}`}
          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => {
            console.log('Search result clicked:', result); // Debug log
            onWordSelect(result);
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{result.word}</h3>
              {result.pronunciation && (
                <p className="text-sm text-gray-600">[{result.pronunciation}]</p>
              )}
              {result.definition && (
                <p className="text-gray-700 mt-1">{result.definition}</p>
              )}
            </div>
            <div className="text-blue-600 hover:text-blue-800">
              →
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}