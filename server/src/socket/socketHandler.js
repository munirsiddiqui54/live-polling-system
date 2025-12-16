const { SOCKET_EVENTS, USER_ROLES } = require('../config/constants');
const { validatePollData, validateStudentName, formatError, formatSuccess } = require('../utils/helpers');
const Poll = require('../models/Poll');
const StudentManager = require('../models/Student');

// Initialize models
const pollManager = new Poll();
const studentManager = new StudentManager();

// Store active poll timer
let pollTimer = null;

/**
 * Initialize Socket.io event handlers
 */
function initializeSocketHandlers(io) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Track user role
    socket.role = null;

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


    /**
     * Handle disconnection
     */
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`Client disconnected: ${socket.id}`);

      if (socket.role === USER_ROLES.STUDENT) {
        const student = studentManager.disconnectStudent(socket.id);
        if (student) {
          console.log(`Student left: ${student.name}`);
        }
      }
    });
  });

  console.log('Socket.io handlers initialized');
}

module.exports = { initializeSocketHandlers };
