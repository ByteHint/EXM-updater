# EXM Tweaks Desktop Application

**Electron** + **React** + **Express** + **MongoDB** (MERN) boilerplate for system optimization, backup, and performance tweaking. This desktop app provides users with real‑time system metrics, one‑click performance tweaks, backup/restore functionality, and a built‑in AI assistant.

## 📦 Tech Stack

| Layer               | Technology                         |
| ------------------- | ---------------------------------- |
| Desktop Shell       | Electron                           |
| Frontend (Renderer) | React, Vite, Tailwind CSS, Zustand |
| Backend (Main API)  | Node.js, Express, Zod, Bcrypt.js   |
| Database            | MongoDB (local or Atlas)           |
| IPC & Persistence   | Electron IPC, electron-store       |
| State & Data Fetch  | Zustand, TanStack Query            |

---

## 🛠️ Prerequisites

- **Node.js** v18+ and npm or Yarn
- **MongoDB** instance (local or remote)
- Windows OS (for PowerShell and registry tweaks)

---

## 📥 Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-org/exm-tweaks.git
    cd exm-tweaks
    ```

2. **Install dependencies**

    ```bash
    npm install          # or yarn install
    ```

3. **Configure environment**

    - Copy `.env.example` to `.env` in the root and `electron/main/`
    - Set `MONGO_URI`, `JWT_SECRET`, `EMAIL_API_KEY`, etc.

4. **Run in development**

    ```bash
    # Start MongoDB first (if local)
    npm run dev          # builds renderer + starts Electron
    ```

---

## ⚙️ Available Scripts

- `npm run dev` – Launch Electron in development with hot reload
- `npm run build` – Bundle React renderer to `electron/dist/renderer`
- `npm run package` – Build installers via electron-builder
- `npm run lint` – Run ESLint across all code
- `npm run test` – Execute unit and integration tests

---

## 📁 Folder Structure

```
/ (root)
├── docs/                   # Markdown docs and architecture
├── electron/
│   ├── main/               # Main process: Express API, IPC handlers, DB
│   └── renderer/           # React app: pages, components, store
├── server/shared/          # Shared types, Zod schemas, utilities
├── scripts/                # Build & packaging scripts
└── package.json
```

---

## 🧩 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/XYZ`)
3. Commit changes and link to a Jira issue
4. Open a PR for review against `develop`
5. Ensure all tests pass and add docs as needed

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

_Built by ByteHint IT Solutions_
