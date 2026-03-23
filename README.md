# NextFlow — AI Workflow Builder

NextFlow is a visual workflow builder inspired by tools like Krea.ai. It allows users to create and execute AI workflows using a node-based interface.

## Features

* Node-based workflow editor using React Flow
* DAG-based execution (cycle detection included)
* Multimodal LLM node (text + image input)
* Image upload and preview
* Crop node for transformation
* Execution history panel with node-level details
* Real-time node status (running, success, error)

## How It Works

1. Add nodes from the sidebar
2. Connect nodes to define flow
3. Run the workflow
4. Execution follows topological order
5. Outputs appear inside nodes
6. History panel logs each run

## Tech Stack

* Next.js
* TypeScript
* React Flow
* Zustand
* Tailwind CSS

## Highlights

* Multimodal data handling
* Level-based execution
* Node-level observability
* Clean and modular architecture

## Future Improvements

* Real LLM integration (Gemini/OpenAI)
* Video processing nodes
* Workflow persistence
* Drag-and-drop sidebar

## Author

Siddhant Gupta
