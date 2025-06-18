// app.ts - Main application entry point

import { LibraryService } from './library-service';
import { Book, Student, BorrowingRecord, BookCategory, GradeLevel } from './models';

class LibraryApp {
  private libraryService: LibraryService;
  private currentSection: string = 'books';

  // DOM Elements
  private booksTab: HTMLElement;
  private studentsTab: HTMLElement;
  private borrowingsTab: HTMLElement;
  private reportsTab: HTMLElement;
  
  private booksSection: HTMLElement;
  private studentsSection: HTMLElement;
  private borrowingsSection: HTMLElement;
  private reportsSection: HTMLElement;

  private bookForm: HTMLFormElement;
  private studentForm: HTMLFormElement;
  private borrowForm: HTMLFormElement;
  private returnForm: HTMLFormElement;

  private booksList: HTMLElement;
  private studentsList: HTMLElement;
  private borrowingsList: HTMLElement;
  private overdueList: HTMLElement;
  
  private bookSearchInput: HTMLInputElement;
  private studentSearchInput: HTMLInputElement;
  private borrowingSearchInput: HTMLInputElement;

  constructor() {
    this.libraryService = new LibraryService();
    this.initializeElements();
    this.setupEventListeners();
    this.loadInitialData();
    this.renderCurrentSection();
  }

  private initializeElements(): void {
    // Tabs
    this.booksTab = document.getElementById('books-tab') as HTMLElement;
    this.studentsTab = document.getElementById('students-tab') as HTMLElement;
    this.borrowingsTab = document.getElementById('borrowings-tab') as HTMLElement;
    this.reportsTab = document.getElementById('reports-tab') as HTMLElement;
    
    // Sections
    this.booksSection = document.getElementById('books-section') as HTMLElement;
    this.studentsSection = document.getElementById('students-section') as HTMLElement;
    this.borrowingsSection = document.getElementById('borrowings-section') as HTMLElement;
    this.reportsSection = document.getElementById('reports-section') as HTMLElement;
    
    // Forms
    this.bookForm = document.getElementById('book-form') as HTMLFormElement;
    this.studentForm = document.getElementById('student-form') as HTMLFormElement;
    this.borrowForm = document.getElementById('borrow-form') as HTMLFormElement;
    this.returnForm = document.getElementById('return-form') as HTMLFormElement;
    
    // Lists
    this.booksList = document.getElementById('books-list') as HTMLElement;
    this.studentsList = document.getElementById('students-list') as HTMLElement;
    this.borrowingsList = document.getElementById('borrowings-list') as HTMLElement;
    this.overdueList = document.getElementById('overdue-list') as HTMLElement;
    
    // Search inputs
    this.bookSearchInput = document.getElementById('book-search') as HTMLInputElement;
    this.studentSearchInput = document.getElementById('student-search') as HTMLInputElement;
    this.borrowingSearchInput = document.getElementById('borrowing-search') as HTMLInputElement;
    
    // Initialize select dropdowns
    this.initializeSelectOptions();
  }

  private initializeSelectOptions(): void {
    // Book Category Select
    const categorySelect = document.getElementById('book-category') as HTMLSelectElement;
    Object.values(BookCategory).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
    
    // Grade Level Select
    const gradeSelect = document.getElementById('student-grade') as HTMLSelectElement;
    Object.values(GradeLevel).forEach(grade => {
      const option = document.createElement('option');
      option.value = grade;
      option.textContent = grade;
      gradeSelect.appendChild(option);
    });
    
    // Book Selects for Borrowing
    const borrowBookSelect = document.getElementById('borrow-book') as HTMLSelectElement;
    const returnBookSelect = document.getElementById('return-book') as HTMLSelectElement;
    
    // Student Selects for Borrowing
    const borrowStudentSelect = document.getElementById('borrow-student') as HTMLSelectElement;
  }

  private setupEventListeners(): void {
    // Tab navigation
    this.booksTab.addEventListener('click', () => this.switchSection('books'));
    this.studentsTab.addEventListener('click', () => this.switchSection('students'));
    this.borrowingsTab.addEventListener('click', () => this.switchSection('borrowings'));
    this.reportsTab.addEventListener('click', () => this.switchSection('reports'));
    
    // Form submissions
    this.bookForm.addEventListener('submit', (e) => this.handleBookFormSubmit(e));
    this.studentForm.addEventListener('submit', (e) => this.handleStudentFormSubmit(e));
    this.borrowForm.addEventListener('submit', (e) => this.handleBorrowFormSubmit(e));
    this.returnForm.addEventListener('submit', (e) => this.handleReturnFormSubmit(e));
    
    // Search inputs
    this.bookSearchInput.addEventListener('input', () => this.renderBooksList());
    this.studentSearchInput.addEventListener('input', () => this.renderStudentsList());
    this.borrowingSearchInput.addEventListener('input', () => this.renderBorrowingsList());
    
    // New item buttons
    document.getElementById('new-book-btn')?.addEventListener('click', () => this.resetBookForm());
    document.getElementById('new-student-btn')?.addEventListener('click', () => this.resetStudentForm());
    
    // Refresh buttons
    document.getElementById('refresh-books-btn')?.addEventListener('click', () => this.renderBooksList());
    document.getElementById('refresh-students-btn')?.addEventListener('click', () => this.renderStudentsList());
    document.getElementById('refresh-borrowings-btn')?.addEventListener('click', () => this.renderBorrowingsList());
    document.getElementById('refresh-reports-btn')?.addEventListener('click', () => this.renderReports());
  }

  private loadInitialData(): void {
    // Check if there's already data in localStorage
    const hasBooks = this.libraryService.getAllBooks().length > 0;
    
    // If no data exists, load sample data
    if (!hasBooks) {
      this.loadSampleData();
    }
    
    // Update the borrowing forms with current books and students
    this.updateBorrowingForms();
  }

  private loadSampleData(): void {
    // Add sample books
    const sampleBooks = [
      new Book('b1', 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, BookCategory.Fiction, 'A3-12', 'https://covers.openlibrary.org/b/id/8452766-L.jpg'),
      new Book('b2', 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, BookCategory.Fiction, 'A3-14', 'https://covers.openlibrary.org/b/id/8438547-L.jpg'),
      new Book('b3', 'A Brief History of Time', 'Stephen Hawking', '9780553380163', 1988, BookCategory.Science, 'B2-05', 'https://covers.openlibrary.org/b/id/8406427-L.jpg'),
      new Book('b4', '1984', 'George Orwell', '9780451524935', 1949, BookCategory.Fiction, 'A4-01', 'https://covers.openlibrary.org/b/id/8442248-L.jpg'),
      new Book('b5', 'The Elements of Style', 'William Strunk Jr.', '9780205309023', 1918, BookCategory.Reference, 'C1-22', 'https://covers.openlibrary.org/b/id/8267825-L.jpg')
    ];
    
    sampleBooks.forEach(book => this.libraryService.addBook(book));
    
    // Add sample students
    const sampleStudents = [
      new Student('s1', 'John', 'Doe', GradeLevel.Tenth, 'john.doe@school.edu'),
      new Student('s2', 'Jane', 'Smith', GradeLevel.Eleventh, 'jane.smith@school.edu'),
      new Student('s3', 'Robert', 'Johnson', GradeLevel.Ninth, 'robert.johnson@school.edu'),
      new Student('s4', 'Emily', 'Davis', GradeLevel.Twelfth, 'emily.davis@school.edu'),
      new Student('s5', 'Michael', 'Wilson', GradeLevel.Faculty, 'michael.wilson@school.edu')
    ];
    
    sampleStudents.forEach(student => this.libraryService.addStudent(student));
    
    // Create some sample borrowings
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const threeWeeksFromNow = new Date(today);
    threeWeeksFromNow.setDate(today.getDate() + 21);
    
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);
    
    const pastDueDate = new Date(today);
    pastDueDate.setDate(today.getDate() - 3);
    
    // Borrow book1 to student1
    try {
      this.libraryService.borrowBook('b1', 's1', 14);
    } catch (error) {
      console.error(error);
    }
    
    // Borrow book2 to student2 (will be overdue)
    try {
      const record = new BorrowingRecord('br1', 'b2', 's2', twoWeeksAgo, pastDueDate);
      this.libraryService.addBook({ ...this.libraryService.getBookById('b2')!, isAvailable: false });
      const student = this.libraryService.getStudentById('s2');
      if (student) {
        student.borrowedBooks.push('b2');
        this.libraryService.updateStudent(student);
      }
      (this.libraryService as any).borrowings.set('br1', record);
      (this.libraryService as any).saveToLocalStorage();
    } catch (error) {
      console.error(error);
    }
  }

  private switchSection(section: string): void {
    this.currentSection = section;
    this.renderCurrentSection();
  }

  private renderCurrentSection(): void {
    // Hide all sections
    this.booksSection.style.display = 'none';
    this.studentsSection.style.display = 'none';
    this.borrowingsSection.style.display = 'none';
    this.reportsSection.style.display = 'none';
    
    // Remove active class from all tabs
    this.booksTab.classList.remove('active');
    this.studentsTab.classList.remove('active');
    this.borrowingsTab.classList.remove('active');
    this.reportsTab.classList.remove('active');
    
    // Show current section and activate tab
    switch (this.currentSection) {
      case 'books':
        this.booksSection.style.display = 'block';
        this.booksTab.classList.add('active');
        this.renderBooksList();
        break;
      case 'students':
        this.studentsSection.style.display = 'block';
        this.studentsTab.classList.add('active');
        this.renderStudentsList();
        break;
      case 'borrowings':
        this.borrowingsSection.style.display = 'block';
        this.borrowingsTab.classList.add('active');
        this.renderBorrowingsList();
        this.updateBorrowingForms();
        break;
      case 'reports':
        this.reportsSection.style.display = 'block';
        this.reportsTab.classList.add('active');
        this.renderReports();
        break;
    }
  }

  // Books Section
  private renderBooksList(): void {
    const searchQuery = this.bookSearchInput.value.trim();
    let books: Book[];
    
    if (searchQuery) {
      books = this.libraryService.searchBooks(searchQuery);
    } else {
      books = this.libraryService.getAllBooks();
    }
    
    this.booksList.innerHTML = '';
    
    if (books.length === 0) {
      this.booksList.innerHTML = '<div class="empty-message">No books found.</div>';
      return;
    }
    
    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'card book-card';
      bookCard.innerHTML = `
        <div class="card-header">
          <h3>${book.title}</h3>
          <span class="status ${book.isAvailable ? 'available' : 'borrowed'}">
            ${book.isAvailable ? 'Available' : 'Borrowed'}
          </span>
        </div>
        <div class="card-body">
          <div class="book-info">
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Year:</strong> ${book.publishYear}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Location:</strong> ${book.shelfLocation}</p>
          </div>
          ${book.coverImageUrl ? `<div class="book-cover">
            <img src="${book.coverImageUrl}" alt="${book.title} cover">
          </div>` : ''}
        </div>
        <div class="card-footer">
          <button class="btn btn-primary edit-book" data-id="${book.id}">Edit</button>
          <button class="btn btn-danger delete-book" data-id="${book.id}">Delete</button>
        </div>
      `;
      
      this.booksList.appendChild(bookCard);
      
      // Add event listeners
      bookCard.querySelector('.edit-book')?.addEventListener('click', () => {
        this.editBook(book.id);
      });
      
      bookCard.querySelector('.delete-book')?.addEventListener('click', () => {
        this.deleteBook(book.id);
      });
    });
  }

  private handleBookFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const id = (formData.get('id') as string) || this.generateId();
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const isbn = formData.get('isbn') as string;
    const publishYear = parseInt(formData.get('publish-year') as string);
    const category = formData.get('category') as string;
    const shelfLocation = formData.get('shelf-location') as string;
    const coverImageUrl = formData.get('cover-image-url') as string || undefined;
    
    const book = new Book(
      id,
      title,
      author,
      isbn,
      publishYear,
      category,
      shelfLocation,
      coverImageUrl
    );
    
    // Check if editing existing book
    const existingBook = this.libraryService.getBookById(id);
    if (existingBook) {
      book.isAvailable = existingBook.isAvailable;
      this.libraryService.updateBook(book);
    } else {
      this.libraryService.addBook(book);
    }
    
    this.resetBookForm();
    this.renderBooksList();
    this.updateBorrowingForms();
  }

  private editBook(bookId: string): void {
    const book = this.libraryService.getBookById(bookId);
    if (!book) return;
    
    const form = this.bookForm;
    form.elements.namedItem('id')?.setAttribute('value', book.id);
    form.elements.namedItem('title')?.setAttribute('value', book.title);
    form.elements.namedItem('author')?.setAttribute('value', book.author);
    form.elements.namedItem('isbn')?.setAttribute('value', book.isbn);
    form.elements.namedItem('publish-year')?.setAttribute('value', book.publishYear.toString());
    
    const categorySelect = form.elements.namedItem('category') as HTMLSelectElement;
    for (let i = 0; i < categorySelect.options.length; i++) {
      if (categorySelect.options[i].value === book.category) {
        categorySelect.selectedIndex = i;
        break;
      }
    }
    
    form.elements.namedItem('shelf-location')?.setAttribute('value', book.shelfLocation);
    form.elements.namedItem('cover-image-url')?.setAttribute('value', book.coverImageUrl || '');
    
    // Update submit button text
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.textContent = 'Update Book';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
  }

  private deleteBook(bookId: string): void {
    try {
      this.libraryService.deleteBook(bookId);
      this.renderBooksList();
      this.updateBorrowingForms();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  private resetBookForm(): void {
    this.bookForm.reset();
    this.bookForm.elements.namedItem('id')?.setAttribute('value', '');
    
    // Reset submit button text
    const submitBtn = this.bookForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.textContent = 'Add Book';
  }

  // Students Section
  private renderStudentsList(): void {
    const searchQuery = this.studentSearchInput.value.trim();
    let students: Student[];
    
    if (searchQuery) {
      students = this.libraryService.searchStudents(searchQuery);
    } else {
      students = this.libraryService.getAllStudents();
    }
    
    this.studentsList.innerHTML = '';
    
    if (students.length === 0) {
      this.studentsList.innerHTML = '<div class="empty-message">No students found.</div>';
      return;
    }
    
    students.forEach(student => {
      const studentCard = document.createElement('div');
      studentCard.className = 'card student-card';
      
      // Get borrowed books info
      const borrowedBooksCount = student.borrowedBooks.length;
      const borrowedBooksInfo = borrowedBooksCount > 0 
        ? `<span class="badge">${borrowedBooksCount} book${borrowedBooksCount !== 1 ? 's' : ''} borrowed</span>`
        : '';
      
      studentCard.innerHTML = `
        <div class="card-header">
          <h3>${student.fullName}</h3>
          ${borrowedBooksInfo}
        </div>
        <div class="card-body">
          <p><strong>ID:</strong> ${student.id}</p>
          <p><strong>Grade:</strong> ${student.grade}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <div class="borrowed-books">
            <h4>Borrowed Books:</h4>
            <ul id="student-${student.id}-books">
              ${student.borrowedBooks.length === 0 ? '<li>No books currently borrowed.</li>' : ''}
            </ul>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary edit-student" data-id="${student.id}">Edit</button>
          <button class="btn btn-danger delete-student" data-id="${student.id}">Delete</button>
        </div>
      `;
      
      this.studentsList.appendChild(studentCard);
      
      // Add event listeners
      studentCard.querySelector('.edit-student')?.addEventListener('click', () => {
        this.editStudent(student.id);
      });
      
      studentCard.querySelector('.delete-student')?.addEventListener('click', () => {
        this.deleteStudent(student.id);
      });
      
      // Populate borrowed books
      const booksList = studentCard.querySelector(`#student-${student.id}-books`) as HTMLElement;
      if (student.borrowedBooks.length > 0) {
        booksList.innerHTML = '';
        student.borrowedBooks.forEach(bookId => {
          const book = this.libraryService.getBookById(bookId);
          if (book) {
            const li = document.createElement('li');
            li.textContent = book.title;
            booksList.appendChild(li);
          }
        });
      }
    });
  }

  private handleStudentFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const id = (formData.get('id') as string) || this.generateId();
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const grade = formData.get('grade') as string;
    const email = formData.get('email') as string;
    
    const student = new Student(
      id,
      firstName,
      lastName,
      grade,
      email
    );
    
    // Check if editing existing student
    const existingStudent = this.libraryService.getStudentById(id);
    if (existingStudent) {
      student.borrowedBooks = existingStudent.borrowedBooks;
      this.libraryService.updateStudent(student);
    } else {
      this.libraryService.addStudent(student);
    }
    
    this.resetStudentForm();
    this.renderStudentsList();
    this.updateBorrowingForms();
  }

  private editStudent(studentId: string): void {
    const student = this.libraryService.getStudentById(studentId);
    if (!student) return;
    
    const form = this.studentForm;
    form.elements.namedItem('id')?.setAttribute('value', student.id);
    form.elements.namedItem('first-name')?.setAttribute('value', student.firstName);
    form.elements.namedItem('last-name')?.setAttribute('value', student.lastName);
    form.elements.namedItem('email')?.setAttribute('value', student.email);
    
    const gradeSelect = form.elements.namedItem('grade') as HTMLSelectElement;
    for (let i = 0; i < gradeSelect.options.length; i++) {
      if (gradeSelect.options[i].value === student.grade) {
        gradeSelect.selectedIndex = i;
        break;
      }
    }
    
    // Update submit button text
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.textContent = 'Update Student';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
  }

  private deleteStudent(studentId: string): void {
    try {
      this.libraryService.deleteStudent(studentId);
      this.renderStudentsList();
      this.updateBorrowingForms();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  private resetStudentForm(): void {
    this.studentForm.reset();
    this.studentForm.elements.namedItem('id')?.setAttribute('value', '');
    
    // Reset submit button text
    const submitBtn = this.studentForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitBtn.textContent = 'Add Student';
  }

  // Borrowing Section
  private renderBorrowingsList(): void {
    const borrowings = this.libraryService.getActiveBorrowings();
    
    this.borrowingsList.innerHTML = '';
    
    if (borrowings.length === 0) {
      this.borrowingsList.innerHTML = '<div class="empty-message">No active borrowings found.</div>';
      return;
    }
    
    borrowings.forEach(borrowing => {
      const book = this.libraryService.getBookById(borrowing.bookId);
      const student = this.libraryService.getStudentById(borrowing.studentId);
      
      if (!book || !student) return;
      
      const borrowingCard = document.createElement('div');
      borrowingCard.className = `card borrowing-card ${borrowing.isOverdue ? 'overdue' : ''}`;
      
      const borrowDate = borrowing.borrowDate.toLocaleDateString();
      const dueDate = borrowing.dueDate.toLocaleDateString();
      const daysLeft = borrowing.isOverdue 
        ? `<span class="overdue-text">Overdue by ${borrowing.daysOverdue} days</span>` 
        : `<span>Due in ${Math.ceil((borrowing.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>`;
      
      borrowingCard.innerHTML = `
        <div class="card-header">
          <h3>${book.title}</h3>
          <span class="status ${borrowing.isOverdue ? 'overdue' : 'active'}">${borrowing.isOverdue ? 'Overdue' : 'Active'}</span>
        </div>
        <div class="card-body">
          <p><strong>Student:</strong> ${student.fullName}</p>
          <p><strong>Borrowed On:</strong> ${borrowDate}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Status:</strong> ${daysLeft}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-success return-book" data-id="${borrowing.id}">Return Book</button>
        </div>
      `;
      
      this.borrowingsList.appendChild(borrowingCard);
      
      // Add event listener for return button
      borrowingCard.querySelector('.return-book')?.addEventListener('click', () => {
        this.returnBook(borrowing.id);
      });
    });
  }

  private updateBorrowingForms(): void {
    // Update book selects
    const availableBooks = this.libraryService.getAllBooks().filter(book => book.isAvailable);
    const borrowBookSelect = document.getElementById('borrow-book') as HTMLSelectElement;
    
    // Get borrowing books
    const activeBorrowings = this.libraryService.getActiveBorrowings();
    const returnBookSelect = document.getElementById('return-book') as HTMLSelectElement;
    
    // Clear previous options
    borrowBookSelect.innerHTML = '<option value="">Select a book</option>';
    returnBookSelect.innerHTML = '<option value="">Select a borrowing</option>';
    
    // Add available books to borrow select
    availableBooks.forEach(book => {
      const option = document.createElement('option');
      option.value = book.id;
      option.textContent = book.title;
      borrowBookSelect.appendChild(option);
    });
    
    // Add borrowed books to return select
    activeBorrowings.forEach(borrowing => {
      const book = this.libraryService.getBookById(borrowing.bookId);
      const student = this.libraryService.getStudentById(borrowing.studentId);
      
      if (book && student) {
        const option = document.createElement('option');
        option.value = borrowing.id;
        option.textContent = `${book.title} (${student.fullName})`;
        returnBookSelect.appendChild(option);
      }
    });
    
    // Update student select
    const students = this.libraryService.getAllStudents();
    const borrowStudentSelect = document.getElementById('borrow-student') as HTMLSelectElement;
    
    // Clear previous options
    borrowStudentSelect.innerHTML = '<option value="">Select a student</option>';
    
    // Add students to select
    students.forEach(student => {
      const option = document.createElement('option');
      option.value = student.id;
      option.textContent = student.fullName;
      borrowStudentSelect.appendChild(option);
    });
  }

  private handleBorrowFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const bookId = formData.get('book') as string;
    const studentId = formData.get('student') as string;
    const daysToReturn = parseInt(formData.get('days') as string) || 14;
    
    try {
      this.libraryService.borrowBook(bookId, studentId, daysToReturn);
      form.reset();
      this.updateBorrowingForms();
      this.renderBorrowingsList();
      this.renderStudentsList();
      this.renderBooksList();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  private handleReturnFormSubmit(e: Event): void {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const borrowingId = formData.get('borrowing') as string;
    
    if (borrowingId) {
      this.returnBook(borrowingId);
      form.reset();
    }
  }

  private returnBook(borrowingId: string): void {
    try {
      this.libraryService.returnBook(borrowingId);
      this.updateBorrowingForms();
      this.renderBorrowingsList();
      this.renderStudentsList();
      this.renderBooksList();
      this.renderReports();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  // Reports Section
  private renderReports(): void {
    this.renderOverdueList();
    this.renderStatistics();
  }

  private renderOverdueList(): void {
    const overdueBorrowings = this.libraryService.getOverdueBorrowings();
    
    this.overdueList.innerHTML = '';
    
    if (overdueBorrowings.length === 0) {
      this.overdueList.innerHTML = '<div class="empty-message">No overdue books found.</div>';
      return;
    }
    
    overdueBorrowings.forEach(borrowing => {
      const book = this.libraryService.getBookById(borrowing.bookId);
      const student = this.libraryService.getStudentById(borrowing.studentId);
      
      if (!book || !student) return;
      
      const overdueItem = document.createElement('div');
      overdueItem.className = 'overdue-item';
      
      const dueDate = borrowing.dueDate.toLocaleDateString();
      
      overdueItem.innerHTML = `
        <div class="overdue-book">${book.title}</div>
        <div class="overdue-student">${student.fullName}</div>
        <div class="overdue-date">Due: ${dueDate}</div>
        <div class="overdue-days">Overdue by ${borrowing.daysOverdue} days</div>
        <button class="btn btn-sm btn-success return-book" data-id="${borrowing.id}">Return</button>
      `;
      
      this.overdueList.appendChild(overdueItem);
      
      // Add event listener for return button
      overdueItem.querySelector('.return-book')?.addEventListener('click', () => {
        this.returnBook(borrowing.id);
      });
    });
  }

  private renderStatistics(): void {
    const statsElement = document.getElementById('statistics') as HTMLElement;
    
    // Gather stats
    const totalBooks = this.libraryService.getAllBooks().length;
    const availableBooks = this.libraryService.getAllBooks().filter(book => book.isAvailable).length;
    const borrowedBooks = totalBooks - availableBooks;
    
    const totalStudents = this.libraryService.getAllStudents().length;
    const studentsWithBooks = this.libraryService.getAllStudents().filter(s => s.borrowedBooks.length > 0).length;
    
    const activeBorrowings = this.libraryService.getActiveBorrowings().length;
    const overdueBorrowings = this.libraryService.getOverdueBorrowings().length;
    
    statsElement.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Total Books</div>
          <div class="stat-value">${totalBooks}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Available Books</div>
          <div class="stat-value">${availableBooks}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Borrowed Books</div>
          <div class="stat-value">${borrowedBooks}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Total Students</div>
          <div class="stat-value">${totalStudents}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Students with Books</div>
          <div class="stat-value">${studentsWithBooks}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Active Borrowings</div>
          <div class="stat-value">${activeBorrowings}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Overdue Books</div>
          <div class="stat-value">${overdueBorrowings}</div>
        </div>
      </div>
    `;
  }

  // Helper Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new LibraryApp();
});
