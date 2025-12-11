import React, { useState, useEffect } from 'react';
import api from '../api';
import TakeQuiz from './TakeQuiz';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [takenQuizzes, setTakenQuizzes] = useState([]); // Store IDs of taken quizzes
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Get Username and ID from storage
  const username = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, takenRes] = await Promise.all([
          api.get('/quizzes'),
          api.get(`/student/${userId}/results`)
        ]);
        setQuizzes(quizRes.data);
        setTakenQuizzes(takenRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  if (selectedQuizId) {
    return <TakeQuiz quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />;
  }

  return (
    <div className="dashboard-layout">
      {/* WELCOME MESSAGE */}
      <h1>🎓 Welcome, <span style={{ color: 'var(--primary-color)' }}>{username}</span>!</h1>
      <p>Here are your available exams:</p>

      <h3>Available Quizzes</h3>
      {quizzes.length === 0 ? <p>No quizzes available yet.</p> : (
        <div className="dashboard-grid">
          {quizzes.map((quiz) => {
            const isTaken = takenQuizzes.includes(quiz.id);
            return (
              <div key={quiz.id} className="stat-card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
                <strong>{quiz.title}</strong>
                <p style={{ margin: '5px 0', color: 'var(--text-secondary)' }}>{quiz.description}</p>

                {isTaken ? (
                  <button disabled style={{ backgroundColor: '#9ca3af', cursor: 'not-allowed', marginTop: '1rem' }}>
                    ✅ Completed
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedQuizId(quiz.id)}
                    className="mt-4">
                    Start Quiz
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;