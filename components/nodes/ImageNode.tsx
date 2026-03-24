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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    updateNodeData(id, { image: "", isUploading: true });

    try {
      const authRes = await fetch("/api/upload");
      
      if (!authRes.ok) {
        throw new Error("Ensure TRANSLOADIT_AUTH_KEY and TRANSLOADIT_AUTH_SECRET are in .env.local!");
      }

      const { params, signature } = await authRes.json();

      const formData = new FormData();
      formData.append("params", params);
      formData.append("signature", signature);
      formData.append("file", file);


      const res = await fetch("https://api2.transloadit.com/assemblies", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      

      if (data.error) {
        throw new Error(`Transloadit API Error: ${data.message || data.error}`);
      }

      if (data.uploads && data.uploads.length > 0) {
        updateNodeData(id, { image: data.uploads[0].ssl_url, isUploading: false });
      } else {
        throw new Error("Transloadit returned zero uploads array");
      }
    } catch (err) {
      console.error(err);
      alert(String(err));
      updateNodeData(id, { isUploading: false, image: "" });
    }
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