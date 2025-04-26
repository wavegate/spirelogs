import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import runService from "../services/runService";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const RunUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);

  const uploadMutation = useMutation({
    mutationFn: runService.submitRun,
    onSuccess: () => {
      toast.success("Run uploaded successfully!");
    },
    onError: (error: any) => {
      if (error.response?.data?.error === "alreadyExists") {
        toast.warning("Run already exists");
      } else {
        toast.error("Failed to upload run");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setFailedFiles([]);
      setProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);
    const newFailedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(((i + 1) / files.length) * 100);

      try {
        const jsonData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              resolve(JSON.parse(e.target?.result as string));
            } catch (error) {
              reject(new Error("Invalid JSON"));
            }
          };
          reader.onerror = () => reject(new Error("File read error"));
          reader.readAsText(file);
        });

        await uploadMutation.mutateAsync(jsonData);
      } catch (error) {
        newFailedFiles.push(file.name);
      }
    }

    setFailedFiles(newFailedFiles);
    setIsUploading(false);
    setProgress(0);

    if (newFailedFiles.length > 0) {
      toast.error(
        `Failed to upload ${newFailedFiles.length} files. Check the list below.`
      );
    } else {
      toast.success("All runs processed successfully!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload Runs</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select run files
          </label>
          <input
            type="file"
            accept=".run"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selected files: {files.length}</span>
              <span>Progress: {Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {failedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-red-600 mb-2">
              Failed Files:
            </h3>
            <ul className="text-sm text-red-600">
              {failedFiles.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={files.length === 0 || isUploading}
          className="w-full px-4 py-2 bg-violet-600 text-white rounded-md
            hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload Runs"}
        </button>
      </form>
    </div>
  );
};

export default RunUpload;
