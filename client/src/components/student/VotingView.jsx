import { useState, useEffect } from "react";

function VotingView({ poll, onSubmitAnswer, hasVoted, error: propError }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!poll?.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(poll.expiresAt).getTime();
      const diff = Math.floor((expiry - now) / 1000);

      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [poll]);

  useEffect(() => {
    if (propError) setError(propError);
  }, [propError]);

  const formatTime = (t) => {
    if (t < 60) return `00:${String(t).padStart(2, "0")}`;
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      setError("Please select an option");
      return;
    }
    setError("");
    onSubmitAnswer(selectedOption);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto pt-10 bg-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Question
            </h2>

            {/* Timer */}
            <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question */}
          <div className="rounded-xl overflow-hidden border border-gray-500 mb-6">
            <div className="bg-gray-700 text-white px-5 py-3 text-base font-medium">
              {poll?.question}
            </div>

            {/* Options */}
            <div className="p-5 space-y-4">
              {poll?.options.map((option, index) => {
                const isSelected = selectedOption === option.id;

                return (
                  <button
                    key={option.id}
                    disabled={hasVoted}
                    onClick={() =>
                      !hasVoted && setSelectedOption(option.id)
                    }
                    className={`relative w-full text-left rounded-xl border overflow-hidden transition-all
                      ${
                        hasVoted
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary"
                      }
                      ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 bg-gray-100"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-sm font-semibold
                            ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-white text-primary border"
                            }
                          `}
                        >
                          {index + 1}
                        </div>

                        <span className="text-gray-800 font-medium">
                          {option.text}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="text-primary font-semibold text-sm">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || hasVoted}
              className={`px-10 py-3 rounded-full font-semibold transition shadow
                ${
                  selectedOption !== null && !hasVoted
                    ? "bg-primary text-white hover:scale-[1.02]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {hasVoted ? "Submitted" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingView;
