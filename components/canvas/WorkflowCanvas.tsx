"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import type { Connection, EdgeChange, NodeChange } from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import TextNode from "@/components/nodes/TextNode";
import LLMNode from "@/components/nodes/LLMNode";
import ImageNode from "@/components/nodes/ImageNode";
import CropNode from "@/components/nodes/CropNode";

const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageNode: ImageNode,
  cropNode: CropNode,
};

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  const [isRunning, setIsRunning] = useState(false);
  const addRun = useWorkflowStore((state) => state.addRun);

  // ---------------- React Flow Handlers ----------------

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    useWorkflowStore.setState((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    useWorkflowStore.setState((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    useWorkflowStore.setState((state) => ({
      edges: addEdge(
        { ...params, id: Date.now().toString() },
        state.edges
      ),
    }));
  }, []);

  // ---------------- Data Flow ----------------

  const getInputData = (nodeId: string) => {
    const { nodes, edges } = useWorkflowStore.getState();

    const incomingEdges = edges.filter(
      (edge) => edge.target === nodeId
    );

    return incomingEdges.map((edge) => {
      const sourceNode = nodes.find(
        (n) => n.id === edge.source
      );
      return sourceNode?.data;
    });
  };

  // ---------------- Execution Levels ----------------

  const getExecutionLevels = () => {
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};

    nodes.forEach((node) => {
      inDegree[node.id] = 0;
      adj[node.id] = [];
    });

    edges.forEach((edge) => {
      adj[edge.source].push(edge.target);
      inDegree[edge.target]++;
    });

    const levels: string[][] = [];
    let queue = Object.keys(inDegree).filter((id) => inDegree[id] === 0);

    while (queue.length > 0) {
      levels.push(queue);

      const nextQueue: string[] = [];

      queue.forEach((nodeId) => {
        adj[nodeId].forEach((neighbor) => {
          inDegree[neighbor]--;
          if (inDegree[neighbor] === 0) {
            nextQueue.push(neighbor);
          }
        });
      });

      queue = nextQueue;
    }

    return levels;
  };

  // ---------------- Cycle Detection ----------------

  const hasCycle = () => {
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};

    nodes.forEach((node) => {
      inDegree[node.id] = 0;
      adj[node.id] = [];
    });

    edges.forEach((edge) => {
      adj[edge.source].push(edge.target);
      inDegree[edge.target]++;
    });

    const queue = Object.keys(inDegree).filter(
      (id) => inDegree[id] === 0
    );

    let count = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      count++;

      adj[current].forEach((neighbor) => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }

    return count !== nodes.length;
  };

  // ---------------- Run Workflow ----------------

  const runWorkflow = async () => {
    if (hasCycle()) {
      alert("Cycle detected! Workflow must be a DAG.");
      return;
    }

    const levels = getExecutionLevels();

    for (const level of levels) {
      // 👇 delay for better UX
      await new Promise((res) => setTimeout(res, 700));

      for (const nodeId of level) {
        const { nodes } = useWorkflowStore.getState();
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        const inputs = getInputData(nodeId);


        useWorkflowStore.setState((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    status: "running",
                  },
                }
              : n
          ),
        }));

        try {
          if (node.type === "cropNode") {
            const imageInput = inputs.find((inp) => inp?.image);
          
            await new Promise((res) => setTimeout(res, 400));
          
            useWorkflowStore.setState((state) => ({
              nodes: state.nodes.map((n) =>
                n.id === nodeId
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        image: imageInput?.image,
                        status: "success",
                      },
                    }
                  : n
              ),
            }));
          }
          if (node.type === "llmNode") {
            const textInputs = inputs
              .map((inp) => inp?.text || inp?.output)
              .filter(Boolean);

            const imageInputs = inputs
              .map((inp) => inp?.image)
              .filter(Boolean);

            const combinedText = textInputs.join(" ");

            const output =
              "AI says: " +
              combinedText +
              (imageInputs.length ? " [with image]" : "");

            await new Promise((res) => setTimeout(res, 500));

            useWorkflowStore.setState((state) => ({
              nodes: state.nodes.map((n) =>
                n.id === nodeId
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        output,
                        status: "success",
                      },
                    }
                  : n
              ),
            }));
          }
        } catch {
          useWorkflowStore.setState((state) => ({
            nodes: state.nodes.map((n) =>
              n.id === nodeId
                ? {
                    ...n,
                    data: {
                      ...n.data,
                      status: "error",
                    },
                  }
                : n
            ),
          }));
        }
        addRun({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          status: "success",
        });
      }
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="h-screen w-full relative">
      
      {/* Run Button */}
      <button
        disabled={isRunning}
        className={`absolute top-4 left-72 z-10 px-3 py-1 rounded ${
          isRunning ? "bg-gray-500" : "bg-green-600"
        } text-white`}
        onClick={async () => {
          setIsRunning(true);
          await runWorkflow();
          setIsRunning(false);
        }}
      >
        {isRunning ? "Running..." : "Run"}
      </button>

      {/* Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}