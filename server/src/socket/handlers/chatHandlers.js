const { SOCKET_EVENTS, USER_ROLES } = require('../../config/constants');
const { formatError, formatSuccess } = require('../../utils/helpers');

module.exports = (io, socket, studentManager) => {
  /**
   * CHAT: Send message
   */
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data) => {
    try {
      const { message } = data;
      
      if (!message || message.trim().length === 0) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Message cannot be empty'));
        return;
      }

      let senderName = 'Anonymous';
      let senderRole = 'unknown';

      if (socket.role === USER_ROLES.TEACHER) {
        senderName = 'Teacher';
        senderRole = USER_ROLES.TEACHER;
      } else if (socket.role === USER_ROLES.STUDENT) {
        const student = studentManager.getStudent(socket.id);
        if (student) {
          senderName = student.name;
          senderRole = USER_ROLES.STUDENT;
        }
      }

      const chatMessage = {
        id: Date.now().toString(),
        senderId: socket.id,
        senderName,
        senderRole,
        message: message.trim(),
        timestamp: new Date().toISOString()
      };

      // Broadcast message to all clients
      io.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, formatSuccess('New message', chatMessage));
      console.log(`Message from ${senderName}: ${message}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });
};
