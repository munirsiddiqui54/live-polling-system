const { SOCKET_EVENTS, USER_ROLES } = require('../../config/constants');
const { validateStudentName, formatError, formatSuccess } = require('../../utils/helpers');

module.exports = (io, socket, studentManager, pollManager) => {
  /**
   * STUDENT: Register with name
   */
  socket.on(SOCKET_EVENTS.REGISTER_STUDENT, (data) => {
    try {
      const { name } = data;

      // Validate name
      const validation = validateStudentName(name);
      if (!validation.isValid) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Invalid name', validation.errors));
        return;
      }

      // Register student
      const student = studentManager.registerStudent(socket.id, name.trim());
      socket.role = USER_ROLES.STUDENT;

      socket.emit(SOCKET_EVENTS.SUCCESS, formatSuccess('Registered successfully', {
        studentId: student.id,
        name: student.name
      }));

      // Broadcast updated students list to teacher
      io.emit(SOCKET_EVENTS.STUDENTS_LIST, formatSuccess('Students list updated', {
        students: studentManager.getAllStudents()
      }));

      // Send current active poll if exists
      const activePoll = pollManager.getActivePoll();
      if (activePoll) {
        socket.emit(SOCKET_EVENTS.POLL_CREATED, formatSuccess('Active poll', {
          id: activePoll.id,
          question: activePoll.question,
          options: activePoll.options.map(opt => ({ id: opt.id, text: opt.text })),
          timeLimit: activePoll.timeLimit,
          expiresAt: activePoll.expiresAt
        }));
      }

      console.log(`Student registered: ${student.name} (${student.id})`);
    } catch (error) {
      console.error('Error registering student:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });

  /**
   * TEACHER: Remove a student
   */
  socket.on(SOCKET_EVENTS.REMOVE_STUDENT, (data) => {
    try {
      const { studentId } = data;

      if (socket.role !== USER_ROLES.TEACHER) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Unauthorized. Only teachers can remove students.'));
        return;
      }

      const student = studentManager.removeStudent(studentId);
      if (!student) {
        socket.emit(SOCKET_EVENTS.ERROR, formatError('Student not found'));
        return;
      }

      // Remove student's vote from current poll
      pollManager.removeStudentVote(studentId);

      // Disconnect the student
      const studentSocket = io.sockets.sockets.get(studentId);
      if (studentSocket) {
        studentSocket.emit(SOCKET_EVENTS.STUDENT_REMOVED, formatError('You have been removed by the teacher'));
        studentSocket.disconnect(true);
      }

      // Broadcast updated results
      const results = pollManager.getCurrentResults();
      if (results) {
        io.emit(SOCKET_EVENTS.POLL_RESULTS, formatSuccess('Results updated', results));
      }

      // Broadcast updated students list
      io.emit(SOCKET_EVENTS.STUDENTS_LIST, formatSuccess('Students list updated', {
        students: studentManager.getAllStudents()
      }));

      socket.emit(SOCKET_EVENTS.SUCCESS, formatSuccess(`Student ${student.name} removed`));
      console.log(`Student removed: ${student.name}`);
    } catch (error) {
      console.error('Error removing student:', error);
      socket.emit(SOCKET_EVENTS.ERROR, formatError(error.message));
    }
  });
};
