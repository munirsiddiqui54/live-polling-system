/**
 * Application Constants
 */

const PORT = process.env.PORT || 3001;
const DEFAULT_POLL_TIME_LIMIT = 60; // seconds
const MAX_POLL_TIME_LIMIT = 300; // 5 minutes
const MIN_POLL_TIME_LIMIT = 10; // 10 seconds

const POLL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired'
};

const USER_ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

const SOCKET_EVENTS = {
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Teacher Events
  CREATE_POLL: 'create_poll',
  END_POLL: 'end_poll',
  REMOVE_STUDENT: 'remove_student',
  GET_POLL_HISTORY: 'get_poll_history',
  
  // Student Events
  REGISTER_STUDENT: 'register_student',
  SUBMIT_ANSWER: 'submit_answer',
  
  // Chat Events
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  
  // Broadcast Events
  POLL_CREATED: 'poll_created',
  POLL_RESULTS: 'poll_results',
  POLL_ENDED: 'poll_ended',
  STUDENT_REMOVED: 'student_removed',
  POLL_HISTORY: 'poll_history',
  STUDENTS_LIST: 'students_list',
  ERROR: 'error',
  SUCCESS: 'success'
};

module.exports = {
  PORT,
  DEFAULT_POLL_TIME_LIMIT,
  MAX_POLL_TIME_LIMIT,
  MIN_POLL_TIME_LIMIT,
  POLL_STATUS,
  USER_ROLES,
  SOCKET_EVENTS
};
