# MongoPractice

A tiny full‑stack CRUD app using React + Express + MongoDB (Mongoose) lets you create, list, edit, and delete posts.

## Features

- List all posts in a clean, responsive 3‑column grid (2/1 columns on smaller screens)
- Create new posts with a simple form
- Edit existing posts (edit form appears at the top when you click Edit)
- Delete posts with a confirmation prompt
- Soft pink UI with friendly, readable inputs and placeholders

## Tech Stack

- React + Vite (frontend)
- Express 5 + vite-express (server + dev integration)
- Mongoose 8 (MongoDB ODM)

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB running locally (or a MongoDB Atlas connection string)

## Quick Start (Development)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server (Express + Vite via vite-express):

```bash
npm run dev
```

3. Open the app:

- http://localhost:3000

The server will connect to MongoDB using `MONGO_URI` by default to:

```
mongodb://127.0.0.1:27017/university
```

## Production build

1. Build the client:

```bash
npm run build
```

2. Start the server in production mode (serves built assets from `dist/`):

```bash
npm start
```

3. Open http://localhost:3000

## API

Base URL during dev: `http://localhost:3000`

- GET `/api/posts` – List posts
- GET `/api/posts/:id` – Get a single post
- POST `/api/posts` – Create a post
  - Body: `{ title: string, author: string, body: string, hidden?: boolean }`
- PUT `/api/posts/:id` – Update a post
  - Body: partial of `{ title, author, body, hidden }`
- DELETE `/api/posts/:id` – Delete a post

### Data model

```js
Post = {
  title: String,    // required
  author: String,   // required
  body: String,     // required
  date: Date,       // default now
  hidden: Boolean,  // default false
}
```

## Using the app

- Use the form at the top to create a post (Title, Author, Body are required)
- Each card shows the post content with Edit/Delete buttons inside the card
- Edit opens an editing form at the top; Save to persist or Cancel to discard
- Delete shows a confirmation dialog before removing the post

## Troubleshooting

- MongoDB connection error: Ensure MongoDB is running and `MONGO_URI` is correct
- Port already in use: Something is already listening on 3000. Either stop it or change the port in `src/server/main.js`
- Styles look off or inputs show invisible text: Hard refresh (Cmd+Shift+R) to clear cached CSS
- Changes not reflected on save: Nodemon watches `src/server`, but client HMR is handled by Vite via vite-express. If something gets stuck, stop and re-run `npm run dev`.

## Scripts

- `npm run dev` – Start Express with nodemon; vite-express serves the client during development
- `npm run build` – Build the React client with Vite
- `npm start` – Start the server in production mode (serves `dist/`)

---