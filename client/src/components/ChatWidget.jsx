import { useState, useEffect, useRef } from 'react';
import socket from '../services/socket';

function ChatWidget({ userRole, userName, students = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for new messages
    socket.on('receive_message', (response) => {
      if (response.success && response.data) {
        setMessages(prev => [...prev, response.data]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', { message: newMessage });
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleKickOut = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      socket.emit('remove_student', { studentId });
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark rounded-full shadow-2xl flex items-center justify-center transition-all z-50"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Tabs */}
          <div className="flex border-b border-neutral-gray border-opacity-20">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-gray hover:text-neutral-dark'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 px-4 py-3 font-semibold transition-all ${
                activeTab === 'participants'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-gray hover:text-neutral-dark'
              }`}
            >
              Participants
            </button>
          </div>

          {/* Chat Tab Content */}
          {activeTab === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-neutral-gray text-sm mt-10">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.senderId === socket.id;
                    const isTeacher = msg.senderRole === 'teacher';

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <span className={`text-xs font-semibold ${isTeacher ? 'text-primary' : 'text-neutral-dark'}`}>
                              {msg.senderName}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-neutral-light text-neutral-dark rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <span className="text-xs text-neutral-gray mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-neutral-gray border-opacity-20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-neutral-light rounded-lg border border-neutral-gray border-opacity-20 focus:outline-none focus:border-primary text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      newMessage.trim()
                        ? 'bg-primary hover:bg-primary-dark text-white'
                        : 'bg-neutral-gray bg-opacity-20 text-neutral-gray cursor-not-allowed'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Participants Tab Content */}
          {activeTab === 'participants' && (
            <div className="flex-1 overflow-y-auto p-4">
              {students.length === 0 ? (
                <div className="text-center text-neutral-gray py-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-sm">No students yet</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-gray border-opacity-20">
                    <span className="text-sm font-semibold text-neutral-gray">Name</span>
                    {userRole === 'teacher' && (
                      <span className="text-sm font-semibold text-neutral-gray">Action</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-neutral-dark text-sm">{student.name}</span>
                        {userRole === 'teacher' && (
                          <button
                            onClick={() => handleKickOut(student.id)}
                            className="text-primary hover:text-primary-dark text-sm font-semibold transition-all"
                          >
                            Kick out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatWidget;
