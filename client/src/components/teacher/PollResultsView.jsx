import { useState, useEffect } from "react";

function PollResultsView({ results, onCreateNew, onViewHistory, showTimer = false, pollExpiresAt = null }) {
  const [pollTimeLeft, setPollTimeLeft] = useState(0);
  
  const totalVotes = results.options.reduce(
    (sum, opt) => sum + opt.voteCount,
    0
  );

  // Poll expiry timer (if poll is still active)
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
        {/* Top right button */}
         <div className="flex justify-end mb-6">
          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-full text-sm font-medium shadow hover:opacity-90 transition"
          >
            👁 View Poll history
          </button>
        </div>
      <div className="max-w-3xl bg-white mx-auto pt-10">
        <div className="p-6">
          {/* Poll Timer/Status Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Question
            </h2>
            {pollTimeLeft > 0 ? (
              <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                ⏱ {formatTime(pollTimeLeft)} left
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                ✓ Poll Ended
              </div>
            )}
          </div>

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

          {/* Bottom button */}
          <div className="flex justify-end">
            <button
              onClick={onCreateNew}
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold shadow hover:scale-[1.02] transition"
            >
              + Ask a new question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollResultsView;
