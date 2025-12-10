import React, { useState, useEffect } from 'react';
import api from '../api';

const TakeQuiz = ({ quizId, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await api.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) { console.error("Error loading quiz"); }
    };
    fetchQuizDetails();
  }, [quizId]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await api.post(`/quizzes/${quizId}/submit?user_id=${userId}`, answers);
      setResult(response.data);
    } catch (error) {
      alert("Error submitting quiz");
    }
  };

  if (!quiz) return <p>Loading Quiz...</p>;

  // --- VIEW: SHOW RESULT (UPDATED WITH ROUNDING) ---
  if (result) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🎉 Quiz Completed!</h2>
        <h1>Your Score: {result.score} / {result.total}</h1>
        {/* ROUND OFF TO 2 DECIMALS */}
        <h3>({Number(result.percentage).toFixed(2)}%)</h3>
        
        <button onClick={onBack} style={{ padding: '10px 20px', background: 'gray', color: 'white', border: 'none', cursor:'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- VIEW: SHOW QUESTIONS (Same as before) ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ marginBottom: '10px' }}>Cancel</button>
      <h2>📝 {quiz.title}</h2>
      
      {quiz.questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h4>{index + 1}. {q.question_text}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {['option_a', 'option_b', 'option_c', 'option_d'].map((optKey) => {
               const letter = optKey.split('_')[1].toUpperCase();
               const isSelected = answers[q.id] === letter;
               return (
                 <label key={optKey} style={{ background: isSelected ? '#d1e7dd' : 'transparent', padding: '5px', borderRadius: '4px', cursor:'pointer' }}>
                   <input type="radio" name={`question-${q.id}`} value={letter} onChange={() => handleOptionSelect(q.id, letter)}/>
                   <b> {letter})</b> {q[optKey]}
                 </label>
               );
            })}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', background: 'green', color: 'white', fontSize: '18px', border: 'none', cursor: 'pointer' }}>Submit Quiz</button>
    </div>
  );
};

export default TakeQuiz;