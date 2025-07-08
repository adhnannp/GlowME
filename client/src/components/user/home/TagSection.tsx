import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { searchTag, fetchTopTags } from "@/services/user/user.tag.service";
import { Tag } from "@/interfaces/user.tag.interface";
import { useDebounce } from "@/components/customHooks/useDebounce";

interface TagSectionProps {
  selectedTag: Tag | null;
  onTagSelect: (tag: Tag | null) => void;
}

export const TagSection = ({ selectedTag, onTagSelect }: TagSectionProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Tag[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const loadTopTags = async () => {
      try {
        const topTags = await fetchTopTags();
        setTags(topTags);
      } catch (error) {
        setTags([]);
        console.error("Failed to load top tags:", error);
      }
    };
    loadTopTags();
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
    }

    const searchTags = async () => {
        try {
        const foundTags = await searchTag(debouncedSearch);
        setSearchResults(foundTags);
        } catch (error) {
        console.error("Tag search failed:", error);
        setSearchResults([]);
        }
    };

    searchTags();
  }, [debouncedSearch]);


  const handleTagClick = (tag: Tag) => {
    if (selectedTag?._id === tag._id) {
      onTagSelect(null);
    } else {
      onTagSelect(tag);
      const alreadyExists = tags.some((t) => t._id === tag._id);
      if (!alreadyExists) {
        setTags((prev) => [...prev, tag]);
      }
    }
    setSearch("");
    setSearchResults([]);
  };

  return (
    <div className="w-80 shrink-0">
      <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Tags</h2>

        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => {
            const isSelected = selectedTag?._id === tag._id;
            return (
              <Badge
                key={tag._id}
                onClick={() => handleTagClick(tag)}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {tag.name}
              </Badge>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="w-full"
          />

          {searchResults.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchResults.map((tag) => (
                <Badge
                  key={tag._id}
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
