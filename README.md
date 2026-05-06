# 🎬 StreamNest

StreamNest is a TV discovery dashboard built with Vue 3 and TypeScript using the public [TVMaze API](https://www.tvmaze.com/api).

It provides a simple and intuitive way to browse TV shows by genre, search by title, and view detailed show information.

---

## 🚀 Getting Started

### 1. Requirements

Make sure you have:

* Node.js `20.x` or `22.x`
* npm `10+`

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run the app locally

```bash
npm run dev
```

Once started, open:

👉 [http://localhost:5173](http://localhost:5173)

---

### 4. Build for production

```bash
npm run build
npm run preview
```

---

### 5. Run tests

```bash
npm run test:run
```

Run smoke E2E:

```bash
npm run e2e
```

(Optional coverage)

```bash
npm run coverage
```

---

## ✨ Features

* 📺 Browse TV shows grouped by genre (horizontal rails)
* ⭐ Shows sorted by rating (descending) within each genre
* 🎯 Genre-based browsing and filtering
* 📄 Dedicated genre page (`/genre/:genre`) with load more & back navigation
* 🔍 Search shows by title using debounced API search
* 🎬 Detailed show page with poster, rating, genres, and summary
* ⚡ Loading, empty, and error states across the app
* 📱 Responsive design for mobile, tablet, and desktop
* 🖼️ Lazy-loaded images and skeleton loaders for better UX

---

## 🧱 Tech Stack

* **Vue 3 (Composition API)** – modular and reactive UI
* **TypeScript (strict mode)** – type safety and maintainability
* **Pinia** – state management
* **Vue Router** – navigation and deep linking
* **Vitest + Vue Test Utils** – unit testing
* **SCSS + CSS variables** – lightweight styling approach

---

## 📁 Project Structure

```text
src/
  features/shows/
    components/   # ShowCard, GenreRow, SearchBar, skeletons
    services/     # TVMaze API layer + caching
    types/        # TypeScript interfaces
    views/        # Dashboard, Search, Genre, Detail
  components/     # Shared UI (loader, error, scroll buttons)
  composables/    # Reusable logic (horizontal scrolling)
  router/         # Routes
  store/          # Pinia store
  utils/          # Helpers (grouping, sorting, debounce, stripHtml)
```

---

## 🧠 Architecture Overview

### API Layer

All API calls are centralized in a service layer using `fetch`.
Views do not directly call APIs.

### State Management (Pinia)

Stores manage:

* Dashboard data
* Search results
* Show details
* Loading & error states

### Data Processing

* Shows are grouped by genre using utility functions
* Each genre list is sorted by rating (descending)
* Logic is kept in pure functions for testability

### Component Design

* Components are reusable and focused on UI only
* Business logic is separated into stores and utilities

---

## ⚖️ Assumptions & Trade-offs

* Uses `/shows?page=0` as the main dataset source
* Shows can appear in multiple genres (intentional design choice)
* Search is debounced (~320ms) to balance UX and API calls
* HTML summaries are stripped before rendering
* Caching is in-memory only (resets on refresh)

---

## 🧪 Testing

Unit tests cover:

* Store logic (state management and API flow)
* Utility functions (grouping and sorting)
* Core components (ShowCard, GenreRow, SearchBar)
* Key views (Dashboard, Search, Genre, Detail)

Run verification:

```bash
npm run test:run
npm run e2e
npm run build
```