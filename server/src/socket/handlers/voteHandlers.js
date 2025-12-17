const { SOCKET_EVENTS, USER_ROLES } = require('../../config/constants');
const { formatError, formatSuccess } = require('../../utils/helpers');

module.exports = (io, socket, pollManager, studentManager) => {
  /**
   * STUDENT: Submit answer
   */
  socket.on(SOCKET_EVENTS.SUBMIT_ANSWER, (data) => {
    try {
      const { optionId } = data;

      if (socket.role !== USER_ROLES.STUDENT) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Only students can submit answers'));
        return;
      }

      if (!studentManager.exists(socket.id)) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Student not registered'));
        return;
      }

      // Submit answer
      const results = pollManager.submitAnswer(socket.id, optionId);

      // Send results to the student who just voted
      socket.emit(SOCKET_EVENTS.POLL_RESULTS, formatSuccess('Answer submitted', results));

      // Broadcast updated results to all clients
      io.emit(SOCKET_EVENTS.POLL_RESULTS, formatSuccess('Results updated', results));

      // Broadcast updated students list to teacher
      io.emit(SOCKET_EVENTS.STUDENTS_LIST, formatSuccess('Students list updated', {
        students: studentManager.getAllStudents()
      }));

      console.log(`Student ${socket.id} voted for option ${optionId}`);
    } catch (error) {
      console.error('Error submitting answer:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });
};
