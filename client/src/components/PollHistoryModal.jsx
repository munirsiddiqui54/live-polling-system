import { useEffect } from "react";

function PollHistoryModal({ isOpen, onClose, history }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="w-full h-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="px-4 py-6 w-full max-w-3xl mx-auto bg-white flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-500">
            View <span className="font-semibold text-gray-800">
              Poll History
              </span>
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg">No poll history yet</p>
              <p className="text-sm mt-1">
                Create your first poll to see it here
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-10">
              {history.map((poll, index) => {
                const totalVotes = poll.options.reduce(
                  (sum, opt) => sum + opt.voteCount,
                  0
                );

                return (
                  <div key={poll.id} className="bg-white p-6 ">
                    {/* Question title */}
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      Question {history.length - index}
                    </h3>

                    {/* Question */}
                    <div className="rounded-xl overflow-hidden border border-gray-500 mb-5">
                      <div className="bg-gray-700 text-white px-5 py-3 text-base font-medium">
                        {poll.question}
                      </div>

                      {/* Options */}
                      <div className="p-5 space-y-4">
                        {poll.options.map((option, optIndex) => {
                          const percentage =
                            totalVotes > 0
                              ? Math.round(
                                  (option.voteCount / totalVotes) *
                                    100
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
                                    {optIndex + 1}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PollHistoryModal;
