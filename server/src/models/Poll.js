const { POLL_STATUS, DEFAULT_POLL_TIME_LIMIT } = require('../config/constants');

/**
 * Poll Model - Manages poll state and operations
 */
class Poll {
  constructor() {
    this.currentPoll = null;
    this.pollHistory = [];
  }

  /**
   * Create a new poll
   */
  createPoll(question, options, timeLimit = DEFAULT_POLL_TIME_LIMIT) {
    const poll = {
      id: Date.now().toString(),
      question,
      options: options.map((option, index) => ({
        id: index,
        text: option,
        votes: []
      })),
      timeLimit,
      status: POLL_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + timeLimit * 1000).toISOString(),
      responses: new Map() // studentId -> optionId
    };
    
    this.currentPoll = poll;
    return poll;
  }

  /**
   * Check if a new poll can be created
   */
  canCreateNewPoll(totalStudents) {
    if (!this.currentPoll) {
      return { allowed: true };
    }

    // Check if all students have answered
    const answeredCount = this.currentPoll.responses.size;
    
    if (answeredCount === totalStudents && totalStudents > 0) {
      return { allowed: true };
    }

    return {
      allowed: false,
      message: `Cannot create new poll. ${answeredCount} out of ${totalStudents} students have answered.`
    };
  }

  /**
   * Submit a student's answer
   */
  submitAnswer(studentId, optionId) {
    if (!this.currentPoll) {
      throw new Error('No active poll');
    }

    if (this.currentPoll.status !== POLL_STATUS.ACTIVE) {
      throw new Error('Poll is not active');
    }

    // Check if student already answered
    if (this.currentPoll.responses.has(studentId)) {
      throw new Error('You have already answered this poll');
    }

    // Validate option
    const option = this.currentPoll.options.find(opt => opt.id === optionId);
    if (!option) {
      throw new Error('Invalid option selected');
    }

    // Record the answer
    this.currentPoll.responses.set(studentId, optionId);
    option.votes.push(studentId);

    return this.getCurrentResults();
  }

  /**
   * Get current poll results
   */
  getCurrentResults() {
    if (!this.currentPoll) {
      return null;
    }

    return {
      id: this.currentPoll.id,
      question: this.currentPoll.question,
      status: this.currentPoll.status,
      totalResponses: this.currentPoll.responses.size,
      options: this.currentPoll.options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option.votes.length
      })),
      expiresAt: this.currentPoll.expiresAt
    };
  }

  /**
   * End current poll
   */
  endPoll() {
    if (!this.currentPoll) {
      return null;
    }

    this.currentPoll.status = POLL_STATUS.COMPLETED;
    const results = this.getCurrentResults();
    
    // Archive to history
    this.pollHistory.push({
      ...this.currentPoll,
      completedAt: new Date().toISOString()
    });

    return results;
  }

  /**
   * Expire current poll (called when time runs out)
   */
  expirePoll() {
    if (!this.currentPoll) {
      return null;
    }

    this.currentPoll.status = POLL_STATUS.EXPIRED;
    return this.endPoll();
  }

  /**
   * Get active poll info
   */
  getActivePoll() {
    return this.currentPoll;
  }

  /**
   * Check if student has answered current poll
   */
  hasStudentAnswered(studentId) {
    if (!this.currentPoll) {
      return false;
    }
    return this.currentPoll.responses.has(studentId);
  }

  /**
   * Remove student's vote (when student is removed)
   */
  removeStudentVote(studentId) {
    if (!this.currentPoll) {
      return;
    }

    const optionId = this.currentPoll.responses.get(studentId);
    if (optionId !== undefined) {
      this.currentPoll.responses.delete(studentId);
      
      const option = this.currentPoll.options.find(opt => opt.id === optionId);
      if (option) {
        option.votes = option.votes.filter(id => id !== studentId);
      }
    }
  }

  /**
   * Get poll history
   */
  getPollHistory() {
    return this.pollHistory.map(poll => ({
      id: poll.id,
      question: poll.question,
      totalResponses: poll.responses.size,
      createdAt: poll.createdAt,
      completedAt: poll.completedAt,
      status: poll.status,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option.votes.length
      }))
    }));
  }
}

module.exports = Poll;
