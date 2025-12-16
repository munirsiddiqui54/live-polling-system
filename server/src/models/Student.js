/**
 * Student Model - Manages student state and operations
 */
class StudentManager {
  constructor() {
    this.students = new Map(); // studentId -> student data
  }

  /**
   * Register a new student
   */
  registerStudent(socketId, name) {
    // Check if name is already taken
    const existingStudent = Array.from(this.students.values()).find(
      student => student.name.toLowerCase() === name.toLowerCase()
    );

    if (existingStudent) {
      throw new Error('Name already taken. Please choose a different name.');
    }

    const student = {
      id: socketId,
      name,
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    this.students.set(socketId, student);
    return student;
  }

  /**
   * Get student by ID
   */
  getStudent(studentId) {
    return this.students.get(studentId);
  }

  /**
   * Get all active students
   */
  getAllStudents() {
    return Array.from(this.students.values()).filter(student => student.isActive);
  }

  /**
   * Remove a student
   */
  removeStudent(studentId) {
    const student = this.students.get(studentId);
    if (student) {
      this.students.delete(studentId);
      return student;
    }
    return null;
  }

  /**
   * Mark student as disconnected
   */
  disconnectStudent(studentId) {
    const student = this.students.get(studentId);
    if (student) {
      student.isActive = false;
      this.students.delete(studentId);
      return student;
    }
    return null;
  }

  /**
   * Get total count of active students
   */
  getActiveCount() {
    return this.getAllStudents().length;
  }

  /**
   * Check if student exists
   */
  exists(studentId) {
    return this.students.has(studentId);
  }
}

module.exports = StudentManager;
