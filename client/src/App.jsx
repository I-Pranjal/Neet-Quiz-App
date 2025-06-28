import React, { useState } from 'react';
import QuizForm from './components/QuizForm';
import QuestionCard from './components/QuestionCard';
import Results from './components/Results';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState('input');

  const handleGenerate = async (paragraph, level) => {
    const res = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paragraph, level })
    });
    const data = await res.json();
    setQuestions(data.questions);
    setStage('quiz');
  };

  const handleAnswer = (idx, optionIdx) => {
    setAnswers({ ...answers, [idx]: optionIdx });
  };

  const handleSubmit = () => setStage('results');
  const handleReset = () => {
    setQuestions([]);
    setAnswers({});
    setStage('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative">
      {/* Fixed logo header */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-md">
        <div className="max-w-5xl mx-auto py-2 flex justify-center">
          <img src="./src/components/logo.png" alt="uQuiz Logo" className="h-20" />
        </div>
      </header>

      {/* Content with top padding to prevent overlap */}
      <main className="max-w-5xl mx-auto px-4 pt-30 pb-16">
        {stage === 'input' && <QuizForm onGenerate={handleGenerate} />}

        {stage === 'quiz' && (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="glass-card p-6 rounded-3xl">
                <QuestionCard
                  index={idx}
                  data={q}
                  selected={answers[idx]}
                  onSelect={(optIdx) => handleAnswer(idx, optIdx)}
                />
              </div>
            ))}
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="px-6 py-3 rounded-full bg-gray-300 hover:bg-gray-400 text-black font-semibold shadow-md"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {stage === 'results' && (
          <Results
            questions={questions}
            answers={answers}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
