import { useState } from 'react';

function CreatePollView({ onCreatePoll, error }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      return;
    }

    onCreatePoll({
      question: question.trim(),
      options: validOptions,
      timeLimit: timeLimit
    });

    setQuestion('');
    setOptions(['', '']);
    setTimeLimit(60);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto pt-5">
        <div className="bg-white rounded-2xl p-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-light via-primary to-primary-dark px-4 py-2 rounded-full mb-8 shadow-md">
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
            you'll have the ability to create and manage polls, ask questions, and monitor 
            your students' responses in real-time.
          </p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-neutral-dark font-semibold">
                Enter your question
              </label>
              <div className="relative inline-block">
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="appearance-none px-3 py-1 pr-8
                    bg-neutral-light rounded-lg
                    border border-neutral-gray border-opacity-20
                    focus:outline-none focus:border-primary
                    text-sm"
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={120}>120 seconds</option>
                  <option value={180}>180 seconds</option>
                  <option value={300}>300 seconds</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                  <svg
                    className="w-3 h-3 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 10 6"
                    fill="currentColor"
                  >
                    <path d="M0 0L5 6L10 0H0Z" />
                  </svg>
                </div>
              </div>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is your favorite programming language?"
              className="w-full px-4 py-3 bg-neutral-light rounded-lg border border-neutral-gray border-opacity-20 focus:outline-none focus:border-primary transition-colors resize-none"
              rows="3"
            />
            <div className="text-right text-xs text-neutral-gray mt-1">
              {question.length}/100
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-neutral-dark font-semibold mb-4">Edit Options</h3>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 bg-neutral-light rounded-lg border border-neutral-gray border-opacity-20 focus:outline-none focus:border-primary transition-colors"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
           
            {options.length < 6 && (
              <button
                onClick={handleAddOption}
                className="mt-3 text-primary hover:text-primary-dark font-semibold flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add More option
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="w-full h-px bg-neutral-gray bg-opacity-20 my-6" />

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-full text-white font-semibold transition-all bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl"
            >
              Ask Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePollView;
