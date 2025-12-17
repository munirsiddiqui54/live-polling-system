const { SOCKET_EVENTS, USER_ROLES } = require('../../config/constants');
const { validatePollData, formatError, formatSuccess } = require('../../utils/helpers');

let pollTimer = null;

module.exports = (io, socket, pollManager) => {
  /**
   * TEACHER: Create a new poll
   */
  socket.on(SOCKET_EVENTS.CREATE_POLL, (data) => {
    try {
      const { question, options, timeLimit } = data;

      // Validate poll data
      const validation = validatePollData(question, options, timeLimit);
      if (!validation.isValid) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Invalid poll data', validation.errors));
        return;
      }

      // Create the poll
      const poll = pollManager.createPoll(question, options, timeLimit);
      socket.role = USER_ROLES.TEACHER;

      // Clear existing timer
      if (pollTimer) {
        clearTimeout(pollTimer);
      }

      // Set timer to auto-end poll
      pollTimer = setTimeout(() => {
        const results = pollManager.expirePoll();
        io.emit(SOCKET_EVENTS.POLL_ENDED, formatSuccess('Poll time expired', results));
        pollTimer = null;
      }, poll.timeLimit * 1000);

      // Broadcast poll to all clients
      io.emit(SOCKET_EVENTS.POLL_CREATED, formatSuccess('New poll created', {
        id: poll.id,
        question: poll.question,
        options: poll.options.map(opt => ({ id: opt.id, text: opt.text })),
        timeLimit: poll.timeLimit,
        expiresAt: poll.expiresAt
      }));

      console.log(`Poll created: ${poll.question}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });

  /**
   * TEACHER: End poll manually
   */
  socket.on(SOCKET_EVENTS.END_POLL, () => {
    try {
      if (socket.role !== USER_ROLES.TEACHER) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Unauthorized. Only teachers can end polls.'));
        return;
      }

      // Clear timer
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }

      const results = pollManager.endPoll();
      if (!results) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('No active poll to end'));
        return;
      }

      io.emit(SOCKET_EVENTS.POLL_ENDED, formatSuccess('Poll ended by teacher', results));
      console.log('Poll ended manually');
    } catch (error) {
      console.error('Error ending poll:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });

  /**
   * TEACHER: Get poll history
   */
  socket.on(SOCKET_EVENTS.GET_POLL_HISTORY, () => {
    try {
      if (socket.role !== USER_ROLES.TEACHER) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Unauthorized. Only teachers can view poll history.'));
        return;
      }

      const history = pollManager.getPollHistory();
      socket.emit(SOCKET_EVENTS.POLL_HISTORY, formatSuccess('Poll history', history));
      console.log('Poll history requested');
    } catch (error) {
      console.error('Error getting poll history:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });
};
