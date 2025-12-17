import { useState, useEffect } from "react";

function ResultsView({ results, showTimer = false, timeRemaining = 5, pollExpiresAt = null }) {
  const [countdown, setCountdown] = useState(timeRemaining);
  const [pollTimeLeft, setPollTimeLeft] = useState(0);
  
  const totalVotes = results.options.reduce(
    (sum, opt) => sum + opt.voteCount,
    0
  );

  // Countdown for auto-transition to waiting
  useEffect(() => {
    if (!showTimer) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer]);

  // Poll expiry timer
  useEffect(() => {
    if (!pollExpiresAt) return;

    const updatePollTimer = () => {
      const now = Date.now();
      const expiry = new Date(pollExpiresAt).getTime();
      const diff = Math.floor((expiry - now) / 1000);
      setPollTimeLeft(diff > 0 ? diff : 0);
    };

    updatePollTimer();
    const timer = setInterval(updatePollTimer, 1000);

    return () => clearInterval(timer);
  }, [pollExpiresAt]);

  const formatTime = (t) => {
    if (t < 60) return `00:${String(t).padStart(2, "0")}`;
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Timer notification */}
      {showTimer && countdown > 0 && (
        <div className="max-w-3xl mx-auto mb-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm text-center">
            ⏱️ Transitioning to waiting in <span className="font-semibold">{countdown}</span> seconds...
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto pt-10 bg-white">
        <div className="p-6">
          {/* Poll Timer Header */}
          {pollTimeLeft > 0 && (
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                Question
              </h2>
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                ⏱ {formatTime(pollTimeLeft)} left
              </div>
            </div>
          )}

          {pollTimeLeft === 0 && (
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Question
            </h2>
          )}

          {/* Question box */}
          <div className="rounded-xl overflow-hidden border border-gray-500 mb-6">
            <div className="bg-gray-700 text-white px-5 py-3 text-base font-medium">
              {results.question}
            </div>

            {/* Options */}
            <div className="p-5 space-y-4">
              {results.options.map((option, index) => {
                const percentage =
                  totalVotes > 0
                    ? Math.round(
                        (option.voteCount / totalVotes) * 100
                      )
                    : 0;

                return (
                  <div
                    key={option.id}
                    className="relative bg-gray-100 rounded-xl border border-gray-300 overflow-hidden py-1"
                  >
                    {/* Progress fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-primary/80 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />

                    {/* Content */}
                    <div className="relative flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-primary text-sm font-semibold">
                          {index + 1}
                        </div>

                        <span className="text-gray-800 font-medium">
                          {option.text}
                        </span>
                      </div>

                      <span className="text-gray-800 font-semibold text-sm">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer info */}
          <div className="text-right text-sm text-gray-500">
            Total Responses: {results.totalResponses}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsView;
