const { MIN_POLL_TIME_LIMIT, MAX_POLL_TIME_LIMIT } = require('../config/constants');

/**
 * Validate poll creation data
 */
function validatePollData(question, options, timeLimit) {
  const errors = [];

  // Validate question
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    errors.push('Question is required and must be a non-empty string');
  }

  // Validate options
  if (!Array.isArray(options) || options.length < 2) {
    errors.push('At least 2 options are required');
  }

  if (options && Array.isArray(options)) {
    options.forEach((option, index) => {
      if (!option || typeof option !== 'string' || option.trim().length === 0) {
        errors.push(`Option ${index + 1} must be a non-empty string`);
      }
    });
  }

  // Validate time limit
  if (timeLimit !== undefined) {
    if (typeof timeLimit !== 'number' || timeLimit < MIN_POLL_TIME_LIMIT || timeLimit > MAX_POLL_TIME_LIMIT) {
      errors.push(`Time limit must be between ${MIN_POLL_TIME_LIMIT} and ${MAX_POLL_TIME_LIMIT} seconds`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate student name
 */
function validateStudentName(name) {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (name && name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (name && name.trim().length > 50) {
    errors.push('Name must not exceed 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format error response
 */
function formatError(message, details = null) {
  return {
    success: false,
    message,
    details
  };
}

/**
 * Format success response
 */
function formatSuccess(message, data = null) {
  return {
    success: true,
    message,
    data
  };
}

module.exports = {
  validatePollData,
  validateStudentName,
  formatError,
  formatSuccess
};
