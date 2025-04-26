import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import runService from "../services/runService";
import { toast } from "sonner";

const RunUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: runService.submitRun,
    onSuccess: () => {
      toast.success("Run uploaded successfully!");
      setFile(null);
    },
    onError: (error) => {
      toast.error("Failed to upload run: " + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          uploadMutation.mutate(jsonData);
        } catch (error) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Error reading file");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Run Data</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select run file (JSON)
          </label>
          <input
            type="file"
            accept=".run"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          disabled={!file || uploadMutation.isPending}
          className="px-4 py-2 bg-violet-600 text-white rounded-md
            hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed"
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload Run"}
        </button>
      </form>
    </div>
  );
};

export default RunUpload;
