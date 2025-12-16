import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket, { connectSocket, disconnectSocket } from '../services/socket';
import ChatWidget from '../components/ChatWidget';

function StudentDashboard() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [currentPoll, setCurrentPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    connectSocket();

    // Listen for poll created
    socket.on('poll_created', (response) => {
      if (response.success) {
        setCurrentPoll(response.data);
        setHasVoted(false);
        setSelectedOption(null);
        setResults(null);
        calculateTimeLeft(response.data.expiresAt);
      }
    });

    // Listen for poll results
    socket.on('poll_results', (response) => {
      if (response.success) {
        setResults(response.data);
      }
    });

    // Listen for poll ended
    socket.on('poll_ended', (response) => {
      if (response.success) {
        setResults(response.data);
        setCurrentPoll(null);
      }
    });

    // Listen for success messages
    socket.on('success', (response) => {
      if (response.success && response.data?.studentId) {
        setStudentName(response.data.name);
        setIsRegistered(true);
        setError('');
      }
    });

    // Listen for errors
    socket.on('error', (response) => {
      setError(response.message);
    });

    // Listen for removal
    socket.on('student_removed', () => {
      navigate('/kicked-out');
    });

    // Listen for students list
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
  }, [navigate]);

  const calculateTimeLeft = (expiresAt) => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = Math.floor((expiry - now) / 1000);
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);
  };

  const handleRegister = () => {
    if (nameInput.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    socket.emit('register_student', { name: nameInput.trim() });
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      setError('Please select an option');
      return;
    }
    socket.emit('submit_answer', { optionId: selectedOption });
    setHasVoted(true);
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex bg-white items-center text-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-2xl p-8">
           {/* Logo Badge */}
<div
  className="inline-flex items-center gap-2
  bg-gradient-to-r from-primary-light via-primary to-primary-dark
  px-4 py-2 rounded-full mb-8
  shadow-md"
>
  <img
    src="../assets/intervue_star_icon.png"
    alt="Poll"
    className="w-3 h-3"
  />
  <span className="text-white font-semibold text-xs">
    Intervue Poll
  </span>
</div>


          <h1 className="text-3xl font-bold text-neutral-dark mb-3">
            Let's Get Started
          </h1>
          <p className="text-neutral-gray mb-8">
            If you're a student, you'll be able to <strong>submit your answers</strong>, 
            participate in live polls, and see how your responses compare with your classmates
          </p>

          <div className="mb-6 mx-auto w-2/3 max-w-full">
  <label className="block text-neutral-dark font-semibold mb-2 text-left">
    Enter your Name
  </label>
  <input
    type="text"
    value={nameInput}
    onChange={(e) => setNameInput(e.target.value)}
    placeholder="Munir Siddiqui"
    className="w-full px-4 py-3 bg-neutral-light rounded-lg border border-neutral-gray border-opacity-20 focus:outline-none focus:border-primary transition-colors"
    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
  />
</div>
  

{error && (
  <div className="mb-4 mx-auto w-80 max-w-full p-3 bg-red-100 text-red-700 rounded-lg text-sm text-left">
    {error}
  </div>
)}

<button
  onClick={handleRegister}
  className="mx-auto block w-60 max-w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
>
  Continue
</button>

        </div>
      </div>
    );
  }

  if (!currentPoll && !results) {
    return (
      <div className="min-h-screen p-6 bg-white">
        <div className="max-w-2xl mx-auto text-center pt-40">
          
            {/* Logo Badge */}
<div
  className="inline-flex items-center gap-2
  bg-gradient-to-r from-primary-light via-primary to-primary-dark
  px-4 py-2 rounded-full mb-8
  shadow-md"
>
  <img
    src="../assets/intervue_star_icon.png"
    alt="Poll"
    className="w-3 h-3"
  />
  <span className="text-white font-semibold text-xs">
    Intervue Poll
  </span>
</div>
          <div className="mt-4 flex justify-center">
  <div className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
</div>

 <h2 className="text-2xl font-bold text-neutral-dark my-4">
             Waiting for the teacher to ask questions...
          </h2>
          
        </div>
      </div>
    );
  }

  if (results) {
    const totalVotes = results.options.reduce((sum, opt) => sum + opt.voteCount, 0);

    return (
      <div className="min-h-screen p-6 bg-white">
        <div className="max-w-3xl mx-auto pt-10">
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-xl font-bold text-neutral-dark mb-6">Question</h2>
            
            <div className="text-white rounded-lg mb-6 border border-neutral-gray mb-8">
              <p className="bg-neutral-dark text-lg p-4 rounded-t-lg">{results.question}</p>
           

            <div className="space-y-4 m-4">
              {results.options.map((option) => {
                const percentage = totalVotes > 0 
                  ? Math.round((option.voteCount / totalVotes) * 100) 
                  : 0;

                return (
                  <div key={option.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {String.fromCharCode(65 + option.id)}
                        </div>
                        <span className="text-neutral-dark font-medium">{option.text}</span>
                      </div>
                      <span className="text-neutral-dark font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-light rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
               </div>
            </div>

            <div className="mt-8 text-center text-neutral-gray">
              <p>Total Responses: {results.totalResponses}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function formatTime(timeLeft) {
  if (timeLeft < 60) {
    return String(timeLeft).padStart(2, '0');
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


  return (
    <>
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto pt-10">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-dark">Question 1</h2>
              <div className="flex items-center gap-2 text-red-600">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
               <span className="font-semibold">
  {formatTime(timeLeft)}
</span>

 </div>
            </div>

            <div className="bg-neutral-dark text-white p-4 rounded-lg mb-6">
              <p className="text-lg">{currentPoll?.question}</p>
            </div>

            <div className="space-y-3 mb-8">
              {currentPoll?.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                    selectedOption === option.id
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-neutral-gray border-opacity-20 hover:border-primary hover:border-opacity-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === option.id
                      ? 'border-primary bg-primary'
                      : 'border-neutral-gray'
                  }`}>
                    {selectedOption === option.id && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-neutral-dark font-medium">{option.text}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-10 py-3 rounded-full text-white font-semibold transition-all ${
                  selectedOption !== null
                    ? 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
                    : 'bg-neutral-gray bg-opacity-30 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {isRegistered && <ChatWidget userRole="student" userName={studentName} students={students} />}
    </>
  );
}

export default StudentDashboard;
