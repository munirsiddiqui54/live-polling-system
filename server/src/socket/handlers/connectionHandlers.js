const { SOCKET_EVENTS, USER_ROLES } = require('../../config/constants');
const { formatSuccess } = require('../../utils/helpers');

module.exports = (io, socket, studentManager, pollManager) => {
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log(`Client disconnected: ${socket.id}`);

    if (socket.role === USER_ROLES.STUDENT) {
      const student = studentManager.disconnectStudent(socket.id);
      if (student) {
        console.log(`Student left: ${student.name}`);
        
        pollManager.removeStudentVote(socket.id);
        
        const results = pollManager.getCurrentResults();
        if (results) {
          io.emit(SOCKET_EVENTS.POLL_RESULTS, formatSuccess('Results updated', results));
        }
        
        io.emit(SOCKET_EVENTS.STUDENTS_LIST, formatSuccess('Students list updated', {
          students: studentManager.getAllStudents()
        }));
      }
    }
  });
};
