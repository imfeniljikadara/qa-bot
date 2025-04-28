'use client'; // 👈 This is necessary for hooks like useState

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    setLoading(true);
    setAnswer('');
    setError('');
    try {
      const askRes = await fetch('https://qa-bot-api.onrender.com/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const askData = await askRes.json();
      const taskId = askData.task_id;

      let result = null;
      while (!result) {
        const resultRes = await fetch(`https://qa-bot-api.onrender.com/result/${taskId}`);
        const resultData = await resultRes.json();
        if (resultData.status === 'COMPLETED') {
          result = resultData.result;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 sec
        }
      }

      setAnswer(result);
    } catch (err) {
      console.error(err);
      setError('Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">💬 Gemini Q&A Bot</h1>
      <div className="w-full max-w-md">
        <textarea
          className="w-full p-4 rounded-lg text-black resize-none"
          rows="4"
          placeholder="Ask me anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button
          onClick={handleAsk}
          disabled={!question || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4 disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {answer && (
        <div className="mt-8 w-full max-w-md bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">🧠 Answer:</h2>
          <p>{answer}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
