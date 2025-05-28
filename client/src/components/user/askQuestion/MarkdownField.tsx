import MDEditor from '@uiw/react-md-editor';
import { Label } from "@/components/ui/label";

interface MarkdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
}

export function MarkdownField({ label, value, onChange, error, description }: MarkdownFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-semibold">{label}</Label>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <div className="border rounded-md overflow-hidden">
        <MDEditor
          value={value}
          onChange={(val: string | undefined) => onChange(val || "")}
          preview="live"
          hideToolbar={false}
          height={300}
          data-color-mode="light"
        />
      </div>
      <div className="text-xs text-gray-500">{value.length}/20 characters minimum</div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}