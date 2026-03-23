"use client";

import { Handle, Position } from "reactflow";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function TextNode({
  id,
  data,
}: {
  id: string;
  data: { text: string };
}) {
  const updateNodeData = useWorkflowStore(
    (state) => state.updateNodeData
  );

  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-md w-60">
      
      <Handle type="target" position={Position.Top} />


      <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <p className="text-sm font-semibold text-gray-200">Text</p>
      </div>


      <div className="p-3">
        <textarea
          className="w-full bg-[#0f0f0f] border border-gray-600 rounded p-2 text-sm text-gray-200 outline-none resize-none"
          value={data.text || ""}
          onChange={(e) =>
            updateNodeData(id, { text: e.target.value })
          }
          placeholder="Enter text..."
        />
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}