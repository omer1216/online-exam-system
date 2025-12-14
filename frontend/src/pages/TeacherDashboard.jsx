import React, { useState, useEffect } from 'react';
import api from '../api';

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [results, setResults] = useState([]); // Stores student grades
  const [viewingResults, setViewingResults] = useState(false); // Toggle between Questions vs Results
  const [newQuestion, setNewQuestion] = useState({
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A'
  });

  const fetchQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      setQuizzes(response.data);
    } catch (error) { console.error("Error fetching quizzes"); }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    try {
      await api.post(`/quizzes?user_id=${userId}`, { title, description });
      setTitle(''); setDescription('');
      fetchQuizzes();
    } catch (error) { alert('Error creating quiz'); }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/quizzes/${selectedQuiz.id}/questions`, newQuestion);
      alert('Question Added!');
      setNewQuestion({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' });
    } catch (error) { alert('Failed to add question'); }
  };

  // --- NEW: FETCH RESULTS ---
  const handleViewResults = async (quiz) => {
    try {
      const response = await api.get(`/quizzes/${quiz.id}/results`);
      setResults(response.data);
      setSelectedQuiz(quiz);
      setViewingResults(true); // Show Results Mode
    } catch (error) { alert("No results found or error loading"); }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setViewingResults(false); // Show Questions Mode
  };


  if (selectedQuiz && viewingResults) {
    return (
      <div className="dashboard-layout">
        <button onClick={() => setSelectedQuiz(null)} className="secondary mb-4">← Back</button>
        <div className="card">
          <h2>📊 Results for: {selectedQuiz.title}</h2>
          {results.length === 0 ? <p>No students have taken this quiz yet.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => {
                  const percentage = ((r.score / r.total) * 100).toFixed(2);
                  return (
                    <tr key={index}>
                      <td>{r.student_name}</td>
                      <td>{r.score} / {r.total} ({percentage}%)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW 2: EDIT QUESTIONS ---
  if (selectedQuiz && !viewingResults) {
    return (
      <div className="dashboard-layout">
        <button onClick={() => setSelectedQuiz(null)} className="secondary mb-4">← Back</button>
        <div className="card">
          <h2>📝 Editing: {selectedQuiz.title}</h2>
          <h3>Add Question</h3>
          <form onSubmit={handleAddQuestion} className="form-group">
            <input placeholder="Question Text" value={newQuestion.question_text} onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} required />
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Option A" value={newQuestion.option_a} onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })} required />
              <input placeholder="Option B" value={newQuestion.option_b} onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })} required />
              <input placeholder="Option C" value={newQuestion.option_c} onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })} required />
              <input placeholder="Option D" value={newQuestion.option_d} onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })} required />
            </div>
            <label>Correct:
              <select value={newQuestion.correct_option} onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}>
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </label>
            <button type="submit">Add Question</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 3: MAIN LIST ---
  return (
    <div className="dashboard-layout">
      <h1>👨‍🏫 Teacher Dashboard</h1>

      <div className="card mb-4">
        <h3>Create New Quiz</h3>
        <form onSubmit={handleCreateQuiz} className="form-group">
          <input placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button type="submit" style={{ backgroundColor: 'var(--success-color)' }}>Create Quiz</button>
        </form>
      </div>

      <h3>Your Quizzes</h3>
      <div className="dashboard-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="stat-card">
            <div className="flex-between mb-4">
              <strong>{quiz.title}</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{quiz.description}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEditQuiz(quiz)} style={{ backgroundColor: '#fcd34d', color: 'black' }}>Edit</button>
              <button onClick={() => handleViewResults(quiz)}>Results</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;