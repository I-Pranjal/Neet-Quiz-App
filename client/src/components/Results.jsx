import React from 'react';

export default function Results({ questions, answers, onReset }) {
  const score = questions.reduce(
    (acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-white shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-center">
        Your Score: {score} / {questions.length}
      </h2>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const correct = q.correctIndex;
          const userAnswer = answers[idx];
          const isCorrect = userAnswer === correct;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl ${
                isCorrect
                  ? 'bg-green-600/50 border border-green-400'
                  : 'bg-red-600/40 border border-red-400'
              }`}
            >
              <p className="font-semibold">{idx + 1}. {q.question}</p>
              <p className="mt-1 text-sm">
                Correct Answer: <span className="font-bold">{q.options[correct]}</span>
              </p>
              {!isCorrect && (
                <p className="mt-1 text-sm text-yellow-200">
                  Your Answer: <span>{q.options[userAnswer]}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          className="mt-4 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-md hover:scale-105 transition"
          onClick={onReset}
        >
          Try Another Paragraph
        </button>
      </div>
    </div>
  );
}
