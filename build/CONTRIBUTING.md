# 🛠 Contributing Guide

## 🌿 Branching Strategy

### 🔒 Protected Branches:

- `main` — production-ready, stable code. **Do not commit or PR directly.**
- `dev` — active development branch. All features and fixes must branch off from here.

---

## 🧩 Workflow

### Step 1: Clone Only `dev`

```bash
git clone --single-branch --branch dev https://github.com/ByteHint/EDA2.git
cd EDA2
```

### Step 2: Create a New Branch

Use semantic naming like feat/feature-name or fix/bug-name.

```bash
git checkout -b feat/feature-name
```

### Step 3: Make Your Changes

Write clean, modular, and documented code. Linting and formatting will be auto-checked on every commit via GitHub Actions.

### Step 4: Commit Your Changes

Use the following types for clear Git history:

| Type        | Description                                  |
| ----------- | -------------------------------------------- |
| `feat:`     | New feature                                  |
| `fix:`      | Bug fix                                      |
| `docs:`     | Documentation-only changes                   |
| `style:`    | Formatting or style changes                  |
| `refactor:` | Code refactor (no new features/fixes)        |
| `test:`     | Adding/refactoring tests only                |
| `chore:`    | Maintenance tasks (e.g., deps, config files) |

```bash
git add .
git commit -m "feat: add dark mode toggle"
```

### Step 5: Push Your Changes

```bash
git push origin feat/feature-name
```

### Step 6: Create a Pull Request

- Title should follow semantic commit format
- Add a short description of what you changed
- GitHub Action will auto-run for lint & format check

---

## 📝 License

By contributing, you agree that your contributions will be licensed under its MIT [LICENSE](LICENSE).
