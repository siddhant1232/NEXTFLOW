"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function LeftSidebar() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const createNode = (type: string) => {
    addNode({
      id: Date.now().toString(),
      type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {},
    });
  };

  return (
    <div className="w-64 h-screen bg-[#0f0f0f] text-white p-4 border-r border-gray-800">
      <h2 className="text-lg font-semibold mb-6">Nodes</h2>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => createNode("textNode")}
          className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
        >
          ➕ Text Node
        </button>

        <button
          onClick={() => createNode("llmNode")}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
        >
          🤖 LLM Node
        </button>
        <button
          onClick={() => createNode("imageNode")}
          className="bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded"
        >
          🖼️ Image Node
        </button>
        <button
          onClick={() => createNode("cropNode")}
          className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded"
        >
          ✂️ Crop Node
        </button>
      </div>
    </div>
  );
}