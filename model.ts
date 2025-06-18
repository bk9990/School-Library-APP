// models.ts - Contains all the data models for the library system

// Book Model
export class Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  category: string;
  shelfLocation: string;
  isAvailable: boolean;
  coverImageUrl?: string;

  constructor(
    id: string,
    title: string,
    author: string,
    isbn: string,
    publishYear: number,
    category: string,
    shelfLocation: string,
    coverImageUrl?: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.publishYear = publishYear;
    this.category = category;
    this.shelfLocation = shelfLocation;
    this.isAvailable = true;
    this.coverImageUrl = coverImageUrl;
  }
}

// Student Model
export class Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  email: string;
  borrowedBooks: string[]; // Array of book IDs

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    grade: string,
    email: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.grade = grade;
    this.email = email;
    this.borrowedBooks = [];
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Borrowing Record Model
export class BorrowingRecord {
  id: string;
  bookId: string;
  studentId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  isReturned: boolean;

  constructor(
    id: string,
    bookId: string,
    studentId: string,
    borrowDate: Date,
    dueDate: Date
  ) {
    this.id = id;
    this.bookId = bookId;
    this.studentId = studentId;
    this.borrowDate = borrowDate;
    this.dueDate = dueDate;
    this.returnDate = null;
    this.isReturned = false;
  }

  returnBook(returnDate: Date): void {
    this.returnDate = returnDate;
    this.isReturned = true;
  }

  get isOverdue(): boolean {
    if (this.isReturned) return false;
    return new Date() > this.dueDate;
  }

  get daysOverdue(): number {
    if (!this.isOverdue) return 0;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - this.dueDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Categories for books
export enum BookCategory {
  Fiction = "Fiction",
  NonFiction = "Non-Fiction",
  Science = "Science",
  Mathematics = "Mathematics",
  History = "History",
  Biography = "Biography",
  Reference = "Reference",
  Literature = "Literature",
  Technology = "Technology",
  Art = "Art"
}

// Grade Levels
export enum GradeLevel {
  Kindergarten = "Kindergarten",
  First = "1st Grade",
  Second = "2nd Grade",
  Third = "3rd Grade",
  Fourth = "4th Grade",
  Fifth = "5th Grade",
  Sixth = "6th Grade",
  Seventh = "7th Grade",
  Eighth = "8th Grade",
  Ninth = "9th Grade",
  Tenth = "10th Grade",
  Eleventh = "11th Grade",
  Twelfth = "12th Grade",
  Faculty = "Faculty"
}
