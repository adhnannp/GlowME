import MDEditor from '@uiw/react-md-editor';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MarkdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function MarkdownField({
  label,
  value,
  onChange,
  error,
  description,
  disabled,
  className,
}: MarkdownFieldProps) {
  return (
    <div className={cn("space-y-2", className, disabled && "opacity-50")}>
      <Label
        className={cn("text-lg font-semibold", disabled && "text-gray-400")}
      >
        {label}
      </Label>
      {description && (
        <p className={cn("text-sm", disabled ? "text-gray-400" : "text-gray-600")}>
          {description}
        </p>
      )}
      <div className={cn("border rounded-md overflow-hidden", disabled && "bg-gray-50")}>
        <MDEditor
          value={value}
          onChange={(val: string | undefined) => !disabled && onChange(val || "")}
          preview="live"
          hideToolbar={false}
          height={300}
          data-color-mode="light"
          disabled={disabled}
        />
      </div>
      <div className={cn("text-xs", disabled ? "text-gray-400" : "text-gray-500")}>
        {value.length}/20 characters minimum
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}