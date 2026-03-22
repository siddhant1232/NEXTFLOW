"use client";

import { Handle, Position } from "reactflow";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function TextNode({ id, data }: { id: string, data: { text: string } }) {
  const updateNodeData = useWorkflowStore(
    (state) => state.updateNodeData
  );

  return (
    <div className="p-3 bg-white rounded shadow w-48 border">
      
      <Handle type="target" position={Position.Top} />

      <p className="text-sm font-semibold mb-2">Text Node</p>

      <textarea
        className="border w-full p-2 text-xs"
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