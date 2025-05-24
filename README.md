# Clips App

[![Deploy to Vercel](https://vercel.com/button)](https://clipzz.vercel.app)

Clips App is a web application built with Angular that allows users to upload, process, and view video clips. The app leverages FFmpeg for video processing and Video.js for seamless video playback. This project demonstrates video handling in the browser with a modern frontend stack.

## Features

- Upload and process video clips directly in the browser
- Play videos using Video.js
- Video processing powered by FFmpeg (WebAssembly)
- User-friendly, responsive interface
- Built with Angular 14 and TailwindCSS
- E2E testing with Cypress

## Demo

Check out the live demo: [clipzz.vercel.app](https://clipzz.vercel.app)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YaSh88991/Clips-App.git
   cd Clips-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the app**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`.

### Build

```bash
npm run build
```

### Running Tests

- **Unit tests:**  
  ```bash
  npm test
  ```
- **E2E tests (Cypress):**  
  ```bash
  npm run cypress:open
  # or for headless
  npm run cypress:run
  ```

## Project Structure

- `src/` - Main application source code
- `src/assets` - Static assets
- `src/styles.css` - Global styles (TailwindCSS)
- `angular.json` - Angular workspace configuration

## Technologies Used

- **Angular 14**
- **FFmpeg (WebAssembly)**
- **Video.js**
- **TailwindCSS**
- **Cypress (E2E testing)**

## Scripts

Common npm scripts:
- `start`: Start the development server
- `build`: Build the app for production
- `test`: Run unit tests
- `e2e`: Run end-to-end tests with Cypress

## License

This project is currently unlicensed. Please contact the author for more information.

## Author

- [@YaSh88991](https://github.com/YaSh88991)

---

> _Happy Clipping!_
