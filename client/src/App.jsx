import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import KickedOut from './pages/KickedOut';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/kicked-out" element={<KickedOut />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
