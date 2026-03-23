"use client";

import { Handle, Position } from "reactflow";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function TextNode({ id, data }: { id: string, data: { text: string } }) {
  const updateNodeData = useWorkflowStore(
    (state) => state.updateNodeData
  );

  return (
    <div className="p-3 rounded-xl shadow-md w-60 border border-gray-300 bg-white">
      
      <Handle type="target" position={Position.Top} />

      <p className="font-semibold text-sm mb-2 text-gray-700">Text Node</p>

      <textarea
        className="border w-full p-2 text-xs text-gray-700"
        value={data.text || ""}
        onChange={(e) =>
          updateNodeData(id, { text: e.target.value })
        }
        placeholder="Enter text..."
      />


      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}