import { useState, useEffect } from 'react';
import socket, { connectSocket, disconnectSocket } from '../services/socket';
import ChatWidget from '../components/ChatWidget';
import PollHistoryModal from '../components/PollHistoryModal';
import CreatePollView from '../components/teacher/CreatePollView';
import ActivePollView from '../components/teacher/ActivePollView';
import PollResultsView from '../components/teacher/PollResultsView';

function TeacherDashboard() {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [pollHistory, setPollHistory] = useState([]);
  const [students, setStudents] = useState([]);
  const [viewState, setViewState] = useState('create');

  useEffect(() => {
    connectSocket();

    socket.on('poll_created', (response) => {
      if (response.success) {
        setCurrentPoll(response.data);
        setResults(null);
        setError('');
        setViewState('active');
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
        setViewState('results');
      }
    });

    socket.on('poll_history', (response) => {
      if (response.success) {
        setPollHistory(response.data);
      }
    });

    socket.on('students_list', (response) => {
      if (response.success && response.data?.students) {
        setStudents(response.data.students);
      }
    });

    socket.on('error', (response) => {
      setError(response.message);
    });

    socket.on('success', (response) => {
      if (response.message.includes('removed')) {
        setError('');
      }
    });

    return () => {
      socket.off('poll_created');
      socket.off('poll_results');
      socket.off('poll_ended');
      socket.off('poll_history');
      socket.off('students_list');
      socket.off('error');
      socket.off('success');
      disconnectSocket();
    };
  }, []);

  const handleCreatePoll = (pollData) => {
    if (!pollData.question || pollData.question.trim().length === 0) {
      setError('Please enter a question');
      return;
    }

    if (pollData.options.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    socket.emit('create_poll', pollData);
  };

  const handleEndPoll = () => {
    socket.emit('end_poll');
  };

  const handleViewHistory = () => {
    socket.emit('get_poll_history');
    setShowHistory(true);
  };

  const handleCreateNew = () => {
    setResults(null);
    setCurrentPoll(null);
    setError('');
    setViewState('create');
  };

  let content;
  if (viewState === 'active' && currentPoll) {
    content = (
      <ActivePollView
        poll={currentPoll}
        results={results}
        onEndPoll={handleEndPoll}
        onViewHistory={handleViewHistory}
      />
    );
  } else if (viewState === 'results' && results) {
    content = (
      <PollResultsView
        results={results}
        onCreateNew={handleCreateNew}
        onViewHistory={handleViewHistory}
        pollExpiresAt={results?.expiresAt}
      />
    );
  } else {
    content = <CreatePollView onCreatePoll={handleCreatePoll} error={error} />;
  }

  return (
    <>
      {content}
      <ChatWidget userRole="teacher" userName="Teacher" students={students} />
      <PollHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} history={pollHistory} />
    </>
  );
}

export default TeacherDashboard;
