import { useEffect } from 'react';

function PollHistoryModal({ isOpen, onClose, history }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div className="w-full h-full bg-white shadow-xl overflow-auto flex flex-col"> {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-gray border-opacity-20 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-dark">View Poll History</h2>
          <button
            onClick={onClose}
            className="hover:bg-neutral-light p-2 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center text-neutral-gray py-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No poll history yet</p>
              <p className="text-sm mt-2">Create your first poll to see it here</p>
            </div>
          ) : (
            <div className="space-y-8">
              {history.map((poll, index) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);

                return (
                  <div key={poll.id}>
                    {/* Question Header */}
                    <h3 className="text-lg font-bold text-neutral-dark mb-4">
                      Question {history.length - index}
                    </h3>

                    {/* Question Text */}
                    <div className="bg-neutral-dark text-white p-4 rounded-lg mb-4">
                      <p className="text-base">{poll.question}</p>
                    </div>

                    {/* Results */}
                    <div className="space-y-3 bg-neutral-light rounded-xl p-4">
                      {poll.options.map((option) => {
                        const percentage = totalVotes > 0 
                          ? Math.round((option.voteCount / totalVotes) * 100) 
                          : 0;

                        return (
                          <div key={option.id}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                                  {String.fromCharCode(65 + option.id)}
                                </div>
                                <span className="text-neutral-dark font-medium text-sm">{option.text}</span>
                              </div>
                              <span className="text-neutral-dark font-bold text-sm">{percentage}%</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
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
