"use client";

import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "reactflow";
import type { Connection, EdgeChange, NodeChange } from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import TextNode from "@/components/nodes/TextNode";
import LLMNode from "@/components/nodes/LLMNode";
import ImageNode from "@/components/nodes/ImageNode";
import CropNode from "@/components/nodes/CropNode";
import { MiniMap } from "reactflow";


const nodeTypes = {
  textNode: TextNode,
  llmNode: LLMNode,
  imageNode: ImageNode,
  cropNode: CropNode,
};

export default function WorkflowCanvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  const addRun = useWorkflowStore((state) => state.addRun);

  const [isRunning, setIsRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { project } = useReactFlow(); 

  // Auto-Load on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/workflows/load");
        const data = await res.json();
        
        if (data && (data.nodes || data.edges)) {
          useWorkflowStore.setState({
            nodes: data.nodes || [],
            edges: data.edges || [],
          });
        }
      } catch (e) {
        console.error("Failed to auto-load workflow", e);
      } finally {
        setIsInitialized(true);
      }
    }
    loadData();
  }, []);

  // Auto-Save on change (debounced to avoid spamming the API)
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(async () => {
      try {
        await fetch("/api/workflows/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nodes, edges }),
        });
        console.log("Auto-saved successfully!");
      } catch (e) {
        console.error("Failed to auto-save workflow", e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [nodes, edges, isInitialized]);



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



  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData("application/reactflow");
    if (!type) return;

    const position = project({
      x: event.clientX,
      y: event.clientY,
    });

    useWorkflowStore.getState().addNode({
      id: Date.now().toString(),
      type,
      position,
      data: {},
    });
  };



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



  const runWorkflow = async () => {
    if (hasCycle()) {
      alert("Cycle detected! Workflow must be a DAG.");
      return;
    }

    const levels = getExecutionLevels();

    for (const level of levels) {
      await new Promise((res) => setTimeout(res, 700));

      for (const nodeId of level) {
        const { nodes } = useWorkflowStore.getState();
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        const inputs = getInputData(nodeId);

        // running state
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
            let resultImage = imageInput?.image;

            if (resultImage) {
              try {
                const res = await fetch("/api/crop", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ imageBase64: resultImage }),
                });

                const data = await res.json();
                if (data.image) {
                  resultImage = data.image;
                }
              } catch (e) {
                console.error("Crop trigger failed:", e);
              }
            }

            useWorkflowStore.setState((state) => ({
              nodes: state.nodes.map((n) =>
                n.id === nodeId
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        image: resultImage,
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

            const combinedText = textInputs.join(" ");

            let output = "";

            try {
              const res = await fetch("/api/llm", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: combinedText }),
              });

              const data = await res.json();
              output = data.output;
            } catch {
              output = "AI says: " + combinedText;
            }

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
                      output: "Something went wrong",
                    },
                  }
                : n
            ),
          }));
        }

        const { nodes: finalNodes } = useWorkflowStore.getState();

        addRun({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          status: "success",
          nodes: finalNodes.map((n) => ({
            id: n.id,
            type: n.type!,
            status: n.data?.status || "unknown",
            output: n.data?.output,
          })),
        });
      }
    }
  };



  return (
    <div className="h-screen w-full relative">

    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
  
        {/* RUN */}
        <button
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg ${
            isRunning ? "bg-gray-500" : "bg-green-600 hover:bg-green-500"
          } text-white`}
          onClick={async () => {
            setIsRunning(true);
            await runWorkflow();
            setIsRunning(false);
          }}
        >
          {isRunning ? "Running..." : "Run"}
        </button>



      </div>


      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}          
        onDragOver={onDragOver} 
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#a855f7", strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
        <MiniMap
          position="bottom-right"
          className="!bg-[#111] !border border-gray-700 rounded-md"
          nodeColor={(node) => {
            switch (node.type) {
              case "textNode":
                return "#9ca3af";
              case "llmNode":
                return "#3b82f6";
              case "imageNode":
                return "#a855f7";
              case "cropNode":
                return "#22c55e";
              default:
                return "#555";
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}