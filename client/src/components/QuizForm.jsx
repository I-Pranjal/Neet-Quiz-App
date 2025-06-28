import React, { useState } from 'react';
import './styling.css'; // Ensure you have the styles imported

export default function QuizForm({ onGenerate }) {
  const [paragraph, setParagraph] = useState('');
  const [level, setLevel] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paragraph.trim()) {
      onGenerate(paragraph, level);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="w-full max-w-md glass-card p-6 rounded-3xl shadow-xl text-white">
        <h1 className="text-3xl font-bold text-center mb-4">UQUIZ</h1>
        <p className="text-center text-sm mb-6">
          Paste NCERT paragraph and choose difficulty to begin your quiz.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            rows="5"
            className="rounded-xl p-3 bg-white/10 border border-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
            placeholder="Paste NCERT paragraph here..."
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="text-white/80">Difficulty:</label>
            <select
              className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg border border-white/20"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option className='text-black' value="easy">Easy</option>
              <option className='text-black' value="medium">Medium</option>
              <option className='text-black' value="hard">Hard</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-md hover:scale-105 transition"
          >
            Generate Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
