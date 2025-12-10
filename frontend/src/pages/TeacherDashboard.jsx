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

  // --- VIEW 1: SHOW RESULTS TABLE ---
  if (selectedQuiz && viewingResults) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setSelectedQuiz(null)} style={{ background: '#ccc', padding: '5px' }}>← Back</button>
        <h2>📊 Results for: {selectedQuiz.title}</h2>
        {results.length === 0 ? <p>No students have taken this quiz yet.</p> : (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ background: '#ddd' }}>
                <th style={{ padding: '10px' }}>Student Name</th>
                <th style={{ padding: '10px' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => {
                // Calculate and round percentage
                const percentage = ((r.score / r.total) * 100).toFixed(2);
                
                return (
                  <tr key={index}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{r.student_name}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {r.score} / {r.total} ({percentage}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // --- VIEW 2: EDIT QUESTIONS ---
  if (selectedQuiz && !viewingResults) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => setSelectedQuiz(null)} style={{ background: '#ccc', padding: '5px' }}>← Back</button>
        <h2>📝 Editing: {selectedQuiz.title}</h2>
        
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>Add Question</h3>
          <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Question Text" value={newQuestion.question_text} onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})} required style={{padding: '8px'}} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
              <input placeholder="Option A" value={newQuestion.option_a} onChange={(e) => setNewQuestion({...newQuestion, option_a: e.target.value})} required />
              <input placeholder="Option B" value={newQuestion.option_b} onChange={(e) => setNewQuestion({...newQuestion, option_b: e.target.value})} required />
              <input placeholder="Option C" value={newQuestion.option_c} onChange={(e) => setNewQuestion({...newQuestion, option_c: e.target.value})} required />
              <input placeholder="Option D" value={newQuestion.option_d} onChange={(e) => setNewQuestion({...newQuestion, option_d: e.target.value})} required />
            </div>
            <label>Correct: <select value={newQuestion.correct_option} onChange={(e) => setNewQuestion({...newQuestion, correct_option: e.target.value})}><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
            <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white' }}>Add Question</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 3: MAIN LIST ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>👨‍🏫 Teacher Dashboard</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Create New Quiz</h3>
        <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: '8px' }} />
          <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '10px', background: 'green', color: 'white' }}>Create Quiz</button>
        </form>
      </div>

      <h3>Your Quizzes</h3>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} style={{ background: '#f4f4f4', margin: '5px 0', padding: '15px', borderLeft: '5px solid blue', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{quiz.title}</strong>
              <p style={{margin:0, fontSize:'0.9em', color:'#666'}}>{quiz.description}</p>
            </div>
            {/* --- THESE ARE THE BUTTONS YOU WERE MISSING --- */}
            <div style={{ display: 'flex', gap: '5px'}}>
              <button onClick={() => handleEditQuiz(quiz)} style={{ background: '#FFC107', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Add Questions</button>
              <button onClick={() => handleViewResults(quiz)} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>View Results</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherDashboard;