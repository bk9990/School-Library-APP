# School Library Management System

A comprehensive web-based library management system built with TypeScript, designed specifically for school libraries. This application helps librarians manage books, students, and borrowing operations efficiently.

## Features

- **Books Management**
  - Add, edit, and delete books
  - Search books by title, author, ISBN, or category
  - Track availability status
  - Store book metadata including cover images

- **Students Management**
  - Register and manage student information
  - Track borrowed books by student
  - Filter students by grade, name, or email

- **Borrowing Operations**
  - Check out books to students
  - Return books
  - Set custom due dates
  - Track overdue books

- **Reporting**
  - View library statistics
  - Monitor overdue books
  - Generate usage reports

## Technologies Used

- TypeScript
- HTML5
- CSS3
- LocalStorage for data persistence
- Object-Oriented Programming principles

## Screenshot

![Library Management System Screenshot](screenshot.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/school-library-management.git
   cd school-library-management
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Build the TypeScript code
   ```bash
   npm run build
   ```

4. Start the development server
   ```bash
   npm start
   ```

The application will open in your default browser at http://localhost:3000.

### Development

To run the development server with automatic TypeScript compilation:

```bash
npm run dev
```

This will start both the TypeScript compiler in watch mode and the lite-server.

## Project Structure

- `models.ts` - Contains data models for Book, Student, and BorrowingRecord
- `library-service.ts` - Core service handling all library operations
- `app.ts` - Main application file connecting the service to the UI
- `index.html` - Main HTML structure
- `styles.css` - Styling for the application

## Data Persistence

The application uses the browser's LocalStorage to persist data. This means:

- Data will be saved between sessions in the same browser
- Data is not shared between different browsers or devices
- Clearing browser data will reset the library database

For a production environment, this should be replaced with a proper backend database.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by real-world library management systems
- Built as a demonstration of TypeScript capabilities for web applications
