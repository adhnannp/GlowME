import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Tag } from "@/services/admin/admin.tag.service";

interface TagFormProps {
  tag?: Tag | null;
  onSave: (tag: Omit<Tag, "_id" | "isListed" | "created_at" | "edited_at">, id?: string) => void;
  onCancel: () => void;
}

export default function TagForm({ tag, onSave, onCancel }: TagFormProps) {
  const [name, setName] = useState(tag?.name || "");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a valid tag name");
      return;
    }

    const newTag = { name };
    onSave(newTag, tag?._id);
    setName("");
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Tag Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="Enter tag name"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-[#FF9838] hover:bg-[#e67f26]"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogFooter>
    </div>
  );
}