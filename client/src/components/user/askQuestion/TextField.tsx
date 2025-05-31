import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  description,
  disabled,
  className,
}: TextFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn("text-base font-medium", disabled && "text-gray-400")}>
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {description && (
        <p className={cn("text-sm", disabled ? "text-gray-400" : "text-gray-600")}>
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}