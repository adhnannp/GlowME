import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface FileFieldProps {
  id: string;
  label: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file?: File | null;
  error?: string;
  isImage?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileField({
  id,
  label,
  accept,
  onChange,
  file,
  error,
  isImage,
  disabled,
  className,
}: FileFieldProps) {

   const inputRef = useRef<HTMLInputElement>(null);
   const handleRemove = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.value = '';
      onChange({ target: { files: null } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const previewUrl = file && isImage ? URL.createObjectURL(file) : undefined;
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={cn("space-y-2", className, disabled && "opacity-50")}>
      <Label
        htmlFor={id}
        className={cn("text-base font-medium", disabled && "text-gray-400")}
      >
        {label}
      </Label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
          id={id}
          ref={inputRef}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
          className={cn(
            "flex items-center gap-2 text-gray-700 hover:bg-gray-100",
            disabled && "cursor-not-allowed"
          )}
          disabled={disabled}
          aria-label={file ? `Replace ${isImage ? "image" : "document"}` : `Add ${isImage ? "image" : "document"}`}
        >
          {isImage ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          {file ? `Replace ${isImage ? "Image" : "Document"}` : `Add ${isImage ? "Image" : "Document"}`}
        </Button>
      </div>
      {file && (
        <div
          className={cn(
            "mt-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200",
            disabled && "bg-gray-50"
          )}
        >
          {isImage && previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt={`Uploaded ${file.name}`}
                className="w-32 h-32 object-cover rounded-md"
                loading="lazy"
              />
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 text-black rounded-full"
                  onClick={handleRemove}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <a
                href={file ? URL.createObjectURL(file) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline",
                  disabled && "text-blue-400 pointer-events-none"
                )}
                aria-label={`View document ${file.name}`}
              >
                <FileText className="h-4 w-4" />
                {file.name}
              </a>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-800"
                  onClick={handleRemove}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}