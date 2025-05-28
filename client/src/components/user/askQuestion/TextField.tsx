import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  description?: string;
}

export function TextField({ id, label, value, onChange, placeholder, error, description }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-lg font-semibold">{label}</Label>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-base"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}