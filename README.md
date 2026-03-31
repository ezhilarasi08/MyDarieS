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

-<img width="1920" height="1020" alt="signIn pages" src="https://github.com/user-attachments/assets/82a37ba6-56f4-4e4f-9224-c19834e2cfff" />
-<img width="1920" height="1020" alt="notes to be remember" src="https://github.com/user-attachments/assets/73dc7215-4331-43d9-93a1-feaa0db9f537" />
-<img width="1920" height="1020" alt="checklist notes" src="https://github.com/user-attachments/assets/9378430d-59d3-4415-a88e-568d57968203" />
-<img width="1920" height="1020" alt="budget notes" src="https://github.com/user-attachments/assets/464d5d23-2da0-49c0-acdc-b9e403e9fc3d" />
-<img width="1920" height="1020" alt="dictonary for saving a new words meaning" src="https://github.com/user-attachments/assets/be1c516d-ce58-431b-bf8c-27a5fa282d97" />
-<img width="1920" height="1020" alt="dichtonomy control" src="https://github.com/user-attachments/assets/1c03c4bf-7bd6-413c-b9df-4d2b7f4b3609" />

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

