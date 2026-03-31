# MyDarieS

A simple daily dashboard app for notes, checklists, budget tracking, and quick reference items.

## What this project is

This app has two parts:

- `client/` — a React front-end built with Vite.
- `server/` — an Express backend that stores data in MongoDB.

The app lets users:

- Register and log in
- Save notes
- Create checklist items
- Track budget entries
- Save dictionary-style items
- Use a simple dichotomy board for control / uncontrolled thoughts

## Tech used

- React
- Vite
- Express
- MongoDB
- Mongoose
- Axios
- JWT authentication
- Nodemailer for email / verification flows

## Setup steps

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd mydaries
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure the backend

Create a `.env` file inside `server/` if you want to use environment variables.

Example `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mydaries
PORT=4000
```

If you do not create `.env`, the server will use:

- MongoDB: `mongodb://127.0.0.1:27017/mydaries`
- Port: `4000`

### 5. Run the backend server

```bash
cd server
npm run dev
```

This starts the server and keeps it running while you develop.

### 6. Run the frontend app

In a separate terminal:

```bash
cd client
npm run dev
```

Open the browser at the address shown by Vite (usually `http://localhost:5173`).

## How to use it

- Register a new account.
- Log in with your email and password.
- Add notes, checklist items, budget entries, and dictionary entries.
- The app keeps data on the server and loads it after login.

## Notes for beginners

- `client/` is the user interface.
- `server/` is the backend API.
- `npm run dev` is the command you use while working on the app.
- If you see `MongoDB connected`, the backend is ready.

## Useful commands

- `cd server && npm run dev` — start backend in developer mode
- `cd client && npm run dev` — start frontend
- `cd client && npm run build` — build the React app for production
- `cd server && npm start` — start the server without watchers

## Need MongoDB?

You can use a local MongoDB installation or a cloud database like MongoDB Atlas.

If you use Atlas, replace `MONGODB_URI` in `.env` with your Atlas connection string.

---

Enjoy building and learning with MyDarieS!

