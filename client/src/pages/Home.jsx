import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/student');
    } else if (selectedRole === 'teacher') {
      navigate('/teacher');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        
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


        {/* Main Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
          Welcome to the <span className="font-bold text-black">Live Polling System</span>
        </h1>
        <p className="text-neutral-gray text-lg mb-12">
          Please select the role that best describes you to begin using the live polling system
        </p>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Student Card */}
          <button
            onClick={() => setSelectedRole('student')}
            className={`p-8 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              selectedRole === 'student'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-neutral-gray border-opacity-30 bg-white'
            }`}
          >
            <h2 className="text-2xl font-bold text-neutral-dark mb-3">
              I'm a Student
            </h2>
            <p className="text-neutral-gray">
              Submit answers and view live poll results in real-time.
            </p>
          </button>

          {/* Teacher Card */}
          <button
            onClick={() => setSelectedRole('teacher')}
            className={`p-8 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
              selectedRole === 'teacher'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-neutral-gray border-opacity-30 bg-white'
            }`}
          >
            <h2 className="text-2xl font-bold text-neutral-dark mb-3">
              I'm a Teacher
            </h2>
            <p className="text-neutral-gray">
              Create polls and view poll results in real-time.
            </p>
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`px-12 py-4 rounded-full text-white font-semibold text-lg transition-all ${
            selectedRole
              ? 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
              : 'bg-neutral-gray bg-opacity-30 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Home;
