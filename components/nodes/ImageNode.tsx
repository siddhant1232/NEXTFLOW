"use client";

import { Handle, Position } from "reactflow";
import { useWorkflowStore } from "@/store/useWorkflowStore";

export default function ImageNode({
  id,
  data,
}: {
  id: string;
  data: { image: string };
}) {
  const updateNodeData = useWorkflowStore(
    (state) => state.updateNodeData
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    updateNodeData(id, { image: url });
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-md w-60">
      
      <Handle type="target" position={Position.Top} />


      <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full" />
        <p className="text-sm font-semibold text-gray-200">Image</p>
      </div>


      <div className="p-3">
        <input
          type="file"
          onChange={handleUpload}
          className="text-xs text-gray-400"
        />

        {data.image ? (
          <img
            src={data.image}
            alt="preview"
            className="mt-2 w-full h-28 object-cover rounded"
          />
        ) : (
          <p className="text-gray-500 text-xs mt-2">No image</p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}