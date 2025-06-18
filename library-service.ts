// library-service.ts - Handles all library operations

import { Book, Student, BorrowingRecord } from './models';

export class LibraryService {
  private books: Map<string, Book> = new Map();
  private students: Map<string, Student> = new Map();
  private borrowings: Map<string, BorrowingRecord> = new Map();
  private storagePrefix = 'school_library_';

  constructor() {
    this.loadFromLocalStorage();
  }

  // Local Storage Operations
  private loadFromLocalStorage(): void {
    const booksData = localStorage.getItem(`${this.storagePrefix}books`);
    const studentsData = localStorage.getItem(`${this.storagePrefix}students`);
    const borrowingsData = localStorage.getItem(`${this.storagePrefix}borrowings`);

    if (booksData) {
      const booksArray: Book[] = JSON.parse(booksData);
      booksArray.forEach(book => {
        this.books.set(book.id, book);
      });
    }

    if (studentsData) {
      const studentsArray: Student[] = JSON.parse(studentsData);
      studentsArray.forEach(student => {
        this.students.set(student.id, student);
      });
    }

    if (borrowingsData) {
      const borrowingsArray: BorrowingRecord[] = JSON.parse(borrowingsData);
      borrowingsArray.forEach(record => {
        // Convert string dates back to Date objects
        record.borrowDate = new Date(record.borrowDate);
        record.dueDate = new Date(record.dueDate);
        record.returnDate = record.returnDate ? new Date(record.returnDate) : null;
        
        this.borrowings.set(record.id, record);
      });
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      `${this.storagePrefix}books`,
      JSON.stringify(Array.from(this.books.values()))
    );
    
    localStorage.setItem(
      `${this.storagePrefix}students`,
      JSON.stringify(Array.from(this.students.values()))
    );
    
    localStorage.setItem(
      `${this.storagePrefix}borrowings`,
      JSON.stringify(Array.from(this.borrowings.values()))
    );
  }

  // Book Operations
  addBook(book: Book): void {
    this.books.set(book.id, book);
    this.saveToLocalStorage();
  }

  updateBook(book: Book): void {
    if (this.books.has(book.id)) {
      this.books.set(book.id, book);
      this.saveToLocalStorage();
    } else {
      throw new Error(`Book with ID ${book.id} not found.`);
    }
  }

  deleteBook(bookId: string): void {
    // Check if book is currently borrowed
    const activeBorrowings = Array.from(this.borrowings.values())
      .filter(record => record.bookId === bookId && !record.isReturned);
    
    if (activeBorrowings.length > 0) {
      throw new Error('Cannot delete a book that is currently borrowed.');
    }
    
    if (this.books.delete(bookId)) {
      this.saveToLocalStorage();
    } else {
      throw new Error(`Book with ID ${bookId} not found.`);
    }
  }

  getBookById(bookId: string): Book | undefined {
    return this.books.get(bookId);
  }

  getAllBooks(): Book[] {
    return Array.from(this.books.values());
  }

  searchBooks(query: string): Book[] {
    query = query.toLowerCase();
    return Array.from(this.books.values()).filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query)
    );
  }

  // Student Operations
  addStudent(student: Student): void {
    this.students.set(student.id, student);
    this.saveToLocalStorage();
  }

  updateStudent(student: Student): void {
    if (this.students.has(student.id)) {
      this.students.set(student.id, student);
      this.saveToLocalStorage();
    } else {
      throw new Error(`Student with ID ${student.id} not found.`);
    }
  }

  deleteStudent(studentId: string): void {
    // Check if student has borrowed books
    const activeBorrowings = Array.from(this.borrowings.values())
      .filter(record => record.studentId === studentId && !record.isReturned);
    
    if (activeBorrowings.length > 0) {
      throw new Error('Cannot delete a student with borrowed books.');
    }
    
    if (this.students.delete(studentId)) {
      this.saveToLocalStorage();
    } else {
      throw new Error(`Student with ID ${studentId} not found.`);
    }
  }

  getStudentById(studentId: string): Student | undefined {
    return this.students.get(studentId);
  }

  getAllStudents(): Student[] {
    return Array.from(this.students.values());
  }

  searchStudents(query: string): Student[] {
    query = query.toLowerCase();
    return Array.from(this.students.values()).filter(student => 
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.grade.toLowerCase().includes(query)
    );
  }

  // Borrowing Operations
  borrowBook(bookId: string, studentId: string, daysToReturn: number = 14): BorrowingRecord {
    const book = this.books.get(bookId);
    const student = this.students.get(studentId);
    
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found.`);
    }
    
    if (!student) {
      throw new Error(`Student with ID ${studentId} not found.`);
    }
    
    if (!book.isAvailable) {
      throw new Error(`Book "${book.title}" is not available for borrowing.`);
    }
    
    // Set up dates
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToReturn);
    
    // Create borrowing record
    const id = this.generateId();
    const record = new BorrowingRecord(
      id,
      bookId,
      studentId,
      borrowDate,
      dueDate
    );
    
    // Update book and student
    book.isAvailable = false;
    student.borrowedBooks.push(bookId);
    
    // Save the record
    this.borrowings.set(id, record);
    this.books.set(bookId, book);
    this.students.set(studentId, student);
    
    this.saveToLocalStorage();
    return record;
  }

  returnBook(borrowingId: string): BorrowingRecord {
    const record = this.borrowings.get(borrowingId);
    
    if (!record) {
      throw new Error(`Borrowing record with ID ${borrowingId} not found.`);
    }
    
    if (record.isReturned) {
      throw new Error('This book has already been returned.');
    }
    
    // Update the record
    record.returnBook(new Date());
    
    // Update book and student
    const book = this.books.get(record.bookId);
    const student = this.students.get(record.studentId);
    
    if (book) {
      book.isAvailable = true;
      this.books.set(record.bookId, book);
    }
    
    if (student) {
      student.borrowedBooks = student.borrowedBooks.filter(id => id !== record.bookId);
      this.students.set(record.studentId, student);
    }
    
    // Save the updated record
    this.borrowings.set(borrowingId, record);
    this.saveToLocalStorage();
    
    return record;
  }

  getBorrowingById(borrowingId: string): BorrowingRecord | undefined {
    return this.borrowings.get(borrowingId);
  }

  getAllBorrowings(): BorrowingRecord[] {
    return Array.from(this.borrowings.values());
  }

  getActiveBorrowings(): BorrowingRecord[] {
    return Array.from(this.borrowings.values()).filter(record => !record.isReturned);
  }

  getOverdueBorrowings(): BorrowingRecord[] {
    return Array.from(this.borrowings.values()).filter(record => record.isOverdue);
  }

  getBorrowingsByStudent(studentId: string): BorrowingRecord[] {
    return Array.from(this.borrowings.values())
      .filter(record => record.studentId === studentId);
  }

  getBorrowingsByBook(bookId: string): BorrowingRecord[] {
    return Array.from(this.borrowings.values())
      .filter(record => record.bookId === bookId);
  }

  // Helper Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
