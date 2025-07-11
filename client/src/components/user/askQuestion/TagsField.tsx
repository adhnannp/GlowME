import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchTags } from '@/services/user/user.AddQuestion.service';
import { Tag } from '@/interfaces/user.tag.interface';
import { cn } from "@/lib/utils"; // Assuming Shadcn/UI's class utility

interface TagsFieldProps {
  label: string;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tag: string) => void;
  error?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function TagsField({
  label,
  tags,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  error,
  description,
  disabled,
  className,
}: TagsFieldProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tagNameMap, setTagNameMap] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldFocusRef = useRef<boolean>(false);

  useEffect(() => {
    if (inputRef.current && shouldFocusRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [availableTags, fetchError, isDropdownOpen, tagNameMap, disabled]);

  useEffect(() => {
    if (!tagInput.trim() || disabled) {
      setAvailableTags([]);
      setFetchError(null);
      setIsDropdownOpen(false);
      return;
    }

    const fetchAvailableTags = async () => {
      setIsLoading(true);
      shouldFocusRef.current = inputRef.current === document.activeElement;
      try {
        const tagsData = await fetchTags(tagInput.trim());
        const filteredTags = tagsData.filter((tag) => !tags.includes(tag._id));
        setAvailableTags(filteredTags);
        const newTagNameMap = tagsData.reduce((map, tag) => {
          map[tag._id] = tag.name;
          return map;
        }, {} as Record<string, string>);
        setTagNameMap((prev) => ({ ...prev, ...newTagNameMap }));
        setFetchError(null);
        setIsDropdownOpen(filteredTags.length > 0);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setFetchError('Failed to load tags. Please try again.');
        setIsDropdownOpen(false);
      } finally {
        setIsLoading(false);
        if (shouldFocusRef.current && inputRef.current && !disabled) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
      }
    };

    const timeoutId = setTimeout(fetchAvailableTags, 300);
    return () => clearTimeout(timeoutId);
  }, [tagInput, tags, disabled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTag = (tagId: string) => {
    if (disabled) return;
    if (tagId && !tags.includes(tagId) && tags.length < 5) {
      onAddTag(tagId);
      onTagInputChange('');
      setAvailableTags([]);
      setIsDropdownOpen(false);
      shouldFocusRef.current = true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onTagInputChange(e.target.value);
      setIsDropdownOpen(!!e.target.value.trim());
      shouldFocusRef.current = true;
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsDropdownOpen(availableTags.length > 0);
      shouldFocusRef.current = true;
    }
  };

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
      <div className="space-y-2 relative" ref={dropdownRef}>
        <Input
          ref={inputRef}
          value={tagInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={isLoading ? 'Loading tags...' : 'Type to search tags (e.g., mongodb)'}
          className={cn("text-base", disabled && "cursor-not-allowed")}
          disabled={isLoading || disabled}
        />
        {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
        {isDropdownOpen && availableTags.length > 0 && !disabled && (
          <div
            role="listbox"
            aria-label="Tag selection"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {availableTags.map((tag) => (
              <div
                key={tag._id}
                role="option"
                className={cn(
                  "px-4 py-2 text-base cursor-pointer hover:bg-blue-50 text-gray-800",
                  disabled && "cursor-not-allowed"
                )}
                onClick={() => handleSelectTag(tag._id)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tagId, index) => (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm",
                  disabled && "bg-blue-50 text-blue-400"
                )}
              >
                {tagNameMap[tagId] || tagId}
                <button
                  type="button"
                  onClick={() => !disabled && onRemoveTag(tagId)} 
                  className={cn(
                    "ml-1 text-blue-600 hover:text-blue-800",
                    disabled && "text-blue-400 cursor-not-allowed"
                  )}
                  disabled={disabled}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className={cn("text-xs", disabled ? "text-gray-400" : "text-gray-500")}>
          {tags.length}/5 tags
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}