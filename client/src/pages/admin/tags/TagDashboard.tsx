import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UserHeader from "@/components/admin/users/UserHeader";
import Pagination from "@/components/admin/users/Pagination";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fetchTags, addTag, updateTag, listTag, unlistTag, Tag } from "@/services/admin/admin.tag.service";
import TagForm from "@/components/admin/Tag/TagForm";
import TagConfirmationDialog from "@/components/admin/Tag/TagConformDialog";

export default function TagDashboard() {
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [action, setAction] = useState<"list" | "unlist">("list");
  const itemsPerPage = 8;

  // Fetch tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const fetchedTags = await fetchTags();
        setFilteredTags(fetchedTags);
      } catch (error) {
      }
    };
    loadTags();
  }, []);

  const handleAddTag = async (
    newTag: Omit<Tag, "_id" | "isListed" | "created_at" | "edited_at">,
    id?: string
  ) => {
    try {
      console.log(id)  
      const createdTag = await addTag(newTag);
      setFilteredTags((prev) => [...prev, createdTag]);
      toast.success("Tag added successfully");
      setIsAddModalOpen(false);
    } catch (error) {
    }
  };

  const handleUpdateTag = async (
    updatedTag: Omit<Tag, "_id" | "isListed" | "created_at" | "edited_at">,
    id?: string
  ) => {
    if (!id || !selectedTag) {
      toast.error("Invalid tag ID");
      return;
    }
    try {
      const modifiedTag = await updateTag({ ...updatedTag, _id: id });
      setFilteredTags((prev) =>
        prev.map((tag) => (tag._id === modifiedTag._id ? modifiedTag : tag))
      );
      toast.success("Tag updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
    }
  };

  const handleListUnlist = (tag: Tag) => {
    setSelectedTag(tag);
    setAction(tag.isListed ? "unlist" : "list");
    setIsConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedTag) return;
    try {
      const updatedTag = selectedTag.isListed
        ? await unlistTag(selectedTag._id)
        : await listTag(selectedTag._id);
      setFilteredTags((prev) =>
        prev.map((tag) => (tag._id === updatedTag._id ? updatedTag : tag))
      );
      toast.success(`Tag ${selectedTag.isListed ? "unlisted" : "listed"} successfully`);
      setIsConfirmationOpen(false);
    } catch (error) {
      // Error is already handled in listTag/unlistTag with toast via handleApiError
    }
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = filteredTags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Tag Management</h1>
          <div className="flex items-center space-x-4">
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Tags</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the tags with their status and creation dates.
                </p>
              </div>
              <Button
                className="bg-[#FF9838] hover:bg-[#e67f26]"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Tag
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Tag Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No tags found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentTags.map((tag) => (
                      <TableRow key={tag._id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell>{tag.isListed ? "Listed" : "Unlisted"}</TableCell>
                        <TableCell>{format(new Date(tag.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            onClick={() => handleListUnlist(tag)}
                            variant={tag.isListed ? "destructive" : "success"}
                            size="sm"
                          >
                            {tag.isListed ? "Unlist" : "List"}
                          </Button>
                          <Button
                            onClick={() => handleEdit(tag)}
                            className="bg-[#FF9838] hover:bg-[#e67f26]"
                            size="sm"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTags.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
          </DialogHeader>
          <TagForm
            onSave={handleAddTag}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          <TagForm
            tag={selectedTag || undefined}
            onSave={handleUpdateTag}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <TagConfirmationDialog
          tagName={selectedTag?.name || ""}
          action={action}
          onConfirm={handleConfirm}
          onCancel={() => setIsConfirmationOpen(false)}
        />
      </Dialog>
    </div>
  );
}