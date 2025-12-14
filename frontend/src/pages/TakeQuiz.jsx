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


  if (result) {
    return (
      <div className="auth-container">
        <div className="card text-center">
          <h2>🎉 Quiz Completed!</h2>
          <h1>Your Score: {result.score} / {result.total}</h1>
          <h3>({Number(result.percentage).toFixed(2)}%)</h3>

          <button onClick={onBack} style={{ backgroundColor: 'var(--secondary-color)', marginTop: '1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <button onClick={onBack} className="secondary mb-4">Cancel</button>
      <div className="card">
        <h2>📝 {quiz.title}</h2>

        {quiz.questions.map((q, index) => (
          <div key={q.id} style={{ marginBottom: '20px', padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
            <h4>{index + 1}. {q.question_text}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['option_a', 'option_b', 'option_c', 'option_d'].map((optKey) => {
                const letter = optKey.split('_')[1].toUpperCase();
                const isSelected = answers[q.id] === letter;
                return (
                  <label key={optKey} style={{
                    background: isSelected ? '#e0e7ff' : '#f9fafb',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--primary-color)' : '1px solid transparent',
                    display: 'block'
                  }}>
                    <input type="radio" name={`question-${q.id}`} value={letter} onChange={() => handleOptionSelect(q.id, letter)} style={{ marginRight: '10px', verticalAlign: 'middle', width: 'auto' }} />
                    <b> {letter})</b> {q[optKey]}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button onClick={handleSubmit} style={{ backgroundColor: 'var(--success-color)', fontSize: '1.2rem' }}>Submit Quiz</button>
      </div>
    </div>
  );
};

export default TakeQuiz;