import { useState } from 'react';

function RegistrationView({ onRegister, error }) {
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = () => {
    if (nameInput.trim().length < 2) {
      return;
    }
    onRegister(nameInput.trim());
  };

  return (
    <div className="min-h-screen flex bg-white items-center text-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl p-8">
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
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        
        {error && (
          <div className="mb-4 mx-auto w-80 max-w-full p-3 bg-red-100 text-red-700 rounded-lg text-sm text-left">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mx-auto block w-60 max-w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default RegistrationView;
