# NextFlow – LLM Workflow Builder

NextFlow is a pixel-perfect workflow builder inspired by Krea.ai, focused on building and executing LLM-based workflows.

---

## 🚀 Features

### 🧠 Core Workflow Engine
- Drag & drop node-based workflow system
- Directed Acyclic Graph (DAG) execution
- Topological sorting for correct execution order
- Parallel execution of independent nodes

### 🔗 Node System
- Text Node (input)
- LLM Node (processing)
- Node-to-node data flow via edges

### ⚡ Execution Engine
- Level-based execution (parallel branches)
- Real-time state updates using Zustand
- Dynamic input aggregation from connected nodes

### 🛡️ Validation
- Cycle detection (prevents invalid workflows)
- Type-safe connections (extensible)

### 📊 Node Status System
- 🟡 Running
- 🟢 Success
- 🔴 Error
- Inline result display on nodes

### 🎨 UI/UX
- Built with React Flow
- Smooth canvas interactions (zoom, pan, minimap)
- Clean node-based interface

---

## 🏗️ Tech Stack

- Next.js (App Router)
- TypeScript
- React Flow
- Zustand (state management)
- Tailwind CSS

---

## ⚙️ Execution Model

Workflows are executed as a DAG:

1. Nodes are grouped into execution levels
2. Independent nodes run in parallel
3. Dependent nodes wait for upstream completion
4. Data flows through edges dynamically

---

## 🔮 Future Improvements

- Trigger.dev integration for real async execution
- Workflow persistence (PostgreSQL + Prisma)
- Authentication (Clerk)
- Execution history panel
- Export/import workflows

---

## 🎯 Demo

will attach soon

---

## 🧑‍💻 Author

Siddhant Gupta