import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, FileText } from "lucide-react";

interface FileFieldProps {
  id: string;
  label: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file?: File;
  error?: string;
  isImage?: boolean;
}

export function FileField({ id, label, accept, onChange, file, error, isImage }: FileFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
          id={id}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
          className="flex items-center gap-2"
        >
          {isImage ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          {file ? `Replace ${isImage ? "Image" : "Document"}` : `Add ${isImage ? "Image" : "Document"}`}
        </Button>
      </div>
      {file && <div className="text-sm text-gray-600">1 {isImage ? "image" : "document"} selected: {file.name}</div>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}