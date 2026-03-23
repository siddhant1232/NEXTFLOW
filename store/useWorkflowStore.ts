import { create } from "zustand";
import type { Edge, Node } from "reactflow";
type Run = {
  id: string;
  timestamp: string;
  status: "success" | "error";
  nodes: {
    id: string;
    type: string;
    status: string;
    output?: string;
  }[];
};


type Store = {
  nodes: Node[];
  edges: Edge[];
  runs: Run[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addRun: (run: Run) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
};

export const useWorkflowStore = create<Store>((set) => ({
  nodes: [],
  edges: [],
  runs: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  addRun: (run) =>
    set((state) => ({ runs: [run, ...state.runs] })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data } : node
      ),
    })),
}));