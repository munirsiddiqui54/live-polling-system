const { SOCKET_EVENTS } = require('../config/constants');
const Poll = require('../models/Poll');
const StudentManager = require('../models/Student');

// Import handlers
const registerPollHandlers = require('./handlers/pollHandlers');
const registerStudentHandlers = require('./handlers/studentHandlers');
const registerVoteHandlers = require('./handlers/voteHandlers');
const registerChatHandlers = require('./handlers/chatHandlers');
const registerConnectionHandlers = require('./handlers/connectionHandlers');

// Initialize models
const pollManager = new Poll();
const studentManager = new StudentManager();

/**
 * Initialize Socket.io event handlers
 */
function initializeSocketHandlers(io) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Track user role
    socket.role = null;

    // Register event handlers
    registerPollHandlers(io, socket, pollManager);
    registerStudentHandlers(io, socket, studentManager, pollManager);
    registerVoteHandlers(io, socket, pollManager, studentManager);
    registerChatHandlers(io, socket, studentManager);
    registerConnectionHandlers(io, socket, studentManager, pollManager);
  });

  console.log('Socket.io handlers initialized');
}

module.exports = { initializeSocketHandlers };
