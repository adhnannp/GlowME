import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-[300px] rounded-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}