"use client";

import { Handle, Position } from "reactflow";

export default function LLMNode({
  id,
  data,
}: {
  id: string;
  data: {
    output?: string;
    status?: "running" | "success" | "error";
  };
}) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-md w-60">
      
      <Handle type="target" position={Position.Top} />


      <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <p className="text-sm font-semibold text-gray-200">LLM</p>
      </div>


      <div className="p-3 text-sm">
        {data?.status === "running" && (
          <p className="text-yellow-400">Running...</p>
        )}

        {data?.status === "success" && (
          <p className="text-green-400">Success</p>
        )}

        {data?.status === "error" && (
          <p className="text-red-400">Error</p>
        )}

        <div className="mt-2 text-gray-400 break-words">
          {data?.output || "No output"}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}