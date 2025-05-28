import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchTags } from '@/services/user/user.AddQuestion.service';
import { Tag } from '@/interfaces/user.tag.interface';

interface TagsFieldProps {
  label: string;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tag: string) => void;
  error?: string;
  description?: string;
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
}: TagsFieldProps) {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tagNameMap, setTagNameMap] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldFocusRef = useRef<boolean>(false);

  // Track when input should retain focus
  useEffect(() => {
    if (inputRef.current && shouldFocusRef.current) {
      inputRef.current.focus();
    }
  }, [availableTags, fetchError, isDropdownOpen, tagNameMap]);

  useEffect(() => {
    if (!tagInput.trim()) {
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
        if (shouldFocusRef.current && inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
      }
    };

    const timeoutId = setTimeout(fetchAvailableTags, 300);
    return () => clearTimeout(timeoutId);
  }, [tagInput, tags]);

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
    if (tagId && !tags.includes(tagId) && tags.length < 5) {
      onAddTag(tagId);
      onTagInputChange('');
      setAvailableTags([]);
      setIsDropdownOpen(false);
      shouldFocusRef.current = true;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTagInputChange(e.target.value);
    setIsDropdownOpen(!!e.target.value.trim());
    shouldFocusRef.current = true;
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(availableTags.length > 0);
    shouldFocusRef.current = true;
  };

  return (
    <div className="space-y-2">
      <Label className="text-lg font-semibold">{label}</Label>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      <div className="space-y-2 relative" ref={dropdownRef}>
        <Input
          ref={inputRef}
          value={tagInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={isLoading ? 'Loading tags...' : 'Type to search tags (e.g., mongodb)'}
          className="text-base"
          disabled={isLoading}
        />
        {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
        {isDropdownOpen && availableTags.length > 0 && (
          <div
            role="listbox"
            aria-label="Tag selection"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {availableTags.map((tag) => (
              <div
                key={tag._id}
                role="option"
                className="px-4 py-2 text-base cursor-pointer hover:bg-blue-50 text-gray-800"
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
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tagNameMap[tagId] || tagId}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tagId)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="text-xs text-gray-500">{tags.length}/5 tags</div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}