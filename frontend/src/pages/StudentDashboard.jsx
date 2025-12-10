import React, { useState, useEffect } from 'react';
import api from '../api';
import TakeQuiz from './TakeQuiz'; 

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  
  // Get Username from storage (We saved the username as the 'token' in the backend)
  const username = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes');
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  if (selectedQuizId) {
    return <TakeQuiz quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* WELCOME MESSAGE */}
      <h1>🎓 Welcome, <span style={{color: '#2196f3'}}>{username}</span>!</h1>
      <p>Here are your available exams:</p>
      
      <h3>Available Quizzes</h3>
      {quizzes.length === 0 ? <p>No quizzes available yet.</p> : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id} 
                style={{ background: '#e3f2fd', margin: '10px 0', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #2196f3' }}>
              <strong>{quiz.title}</strong>
              <p style={{ margin: '5px 0' }}>{quiz.description}</p>
              <button 
                onClick={() => setSelectedQuizId(quiz.id)}
                style={{ padding: '8px 15px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Start Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;