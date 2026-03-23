"use client";

import { Handle, Position } from "reactflow";

export default function CropNode({
  id,
  data,
}: {
  id: string;
  data: { image: string };
}) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-md w-60">
      
      <Handle type="target" position={Position.Top} />


      <div className="px-3 py-2 border-b border-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <p className="text-sm font-semibold text-gray-200">Crop</p>
      </div>


      <div className="p-3 text-sm text-gray-400">
        Simulated crop

        {data.image && (
          <img
            src={data.image}
            className="mt-2 w-full h-28 object-cover rounded"
          />
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}