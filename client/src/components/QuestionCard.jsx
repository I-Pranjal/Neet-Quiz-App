import React from 'react';

export default function QuestionCard({ index, data, selected, onSelect }) {
  return (
    <div className="p-6 rounded-3xl shadow-md bg-white/10 backdrop-blur-sm border border-white/20 text-white space-y-4">
      <p className="text-lg font-semibold">
        {index + 1}. {data.question}
      </p>

      <div className="space-y-3">
        {data.options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 border
                ${
                  isSelected
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
