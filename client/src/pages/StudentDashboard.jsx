import { useState, useEffect } from 'react';
import socket, { connectSocket, disconnectSocket } from '../services/socket';
import ChatWidget from '../components/ChatWidget';
import RegistrationView from '../components/student/RegistrationView';
import WaitingView from '../components/student/WaitingView';
import VotingView from '../components/student/VotingView';
import ResultsView from '../components/student/ResultsView';
import KickedOutView from '../components/student/KickedOutView';

function StudentDashboard() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [currentPoll, setCurrentPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [viewState, setViewState] = useState('registration');

  useEffect(() => {
    connectSocket();

    socket.on('poll_created', (response) => {
      if (response.success) {
        setCurrentPoll(response.data);
        setHasVoted(false);
        setResults(null);
        setError('');
        setViewState('voting');
      }
    });

    socket.on('poll_results', (response) => {
      if (response.success) {
        setResults(response.data);
      }
    });

    socket.on('poll_ended', (response) => {
      if (response.success) {
        setResults(response.data);
        setCurrentPoll(null);
        setHasVoted(false);
        setViewState('results');
      }
    });

    socket.on('success', (response) => {
      if (response.success && response.data?.studentId) {
        setStudentName(response.data.name);
        setIsRegistered(true);
        setError('');
        setViewState('waiting');
      }
    });

    socket.on('error', (response) => {
      setError(response.message);
    });

    socket.on('student_removed', () => {
      setViewState('kicked_out');
    });

    socket.on('students_list', (response) => {
      if (response.success && response.data?.students) {
        setStudents(response.data.students);
      }
    });

    return () => {
      socket.off('poll_created');
      socket.off('poll_results');
      socket.off('poll_ended');
      socket.off('success');
      socket.off('error');
      socket.off('student_removed');
      socket.off('students_list');
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (viewState === 'results' && !currentPoll) {
      const timer = setTimeout(() => {
        setViewState('waiting');
        setResults(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [viewState, currentPoll]);

  const handleRegister = (name) => {
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    socket.emit('register_student', { name: name.trim() });
  };

  const handleSubmitAnswer = (optionId) => {
    if (optionId === null || optionId === undefined) {
      setError('Please select an option');
      return;
    }
    socket.emit('submit_answer', { optionId });
    setHasVoted(true);
    setError('');
    setViewState('results');
  };

  let content;
  if (viewState === 'kicked_out') {
    content = <KickedOutView />;
  } else if (!isRegistered) {
    content = <RegistrationView onRegister={handleRegister} error={error} />;
  } else if (viewState === 'voting' && currentPoll) {
    content = (
      <VotingView
        poll={currentPoll}
        onSubmitAnswer={handleSubmitAnswer}
        hasVoted={hasVoted}
        error={error}
      />
    );
  } else if (viewState === 'results' && results) {
    const expiresAt = currentPoll?.expiresAt || results?.expiresAt;
    content = (
      <ResultsView 
        results={results} 
        showTimer={!currentPoll} 
        timeRemaining={5}
        pollExpiresAt={expiresAt}
      />
    );
  } else {
    content = <WaitingView />;
  }

  return (
    <>
      {content}
      {isRegistered && <ChatWidget userRole="student" userName={studentName} students={students} />}
    </>
  );
}

export default StudentDashboard;
