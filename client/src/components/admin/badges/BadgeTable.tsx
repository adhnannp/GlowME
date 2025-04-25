import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import ConfirmationModal from "./ConfirmationModal"; // Adjust the import path as needed
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { ADMIN_API } from "@/config/adminApi";

export interface Badge {
  _id: string;
  name: string;
  image: string;
  isListed: boolean;
  requiredXp: number;
  created_at: string;
  updated_at: string;
}

interface BadgeTableProps {
  badges: Badge[];
  loading: boolean;
  onEdit: (badge: Badge) => void;
  onUpdateBadge: (updatedBadge: Badge) => void;
}

export default function BadgeTable({ badges, loading, onEdit, onUpdateBadge }: BadgeTableProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [action, setAction] = useState<"list" | "unlist">("list");

  const handleListUnlist = (badge: Badge) => {
    setSelectedBadge(badge);
    setAction(badge.isListed ? "unlist" : "list");
    setIsConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedBadge) return;

    try {
      const endpoint = selectedBadge.isListed
        ? `${ADMIN_API.UNLIST_BADGE}${selectedBadge._id}`
        : `${ADMIN_API.LIST_BADGE}${selectedBadge._id}`;
      const response = await api.patch(endpoint);
      const updatedBadge = response.data.badge;

      // Update the badge in the parent component
      onUpdateBadge(updatedBadge);

      toast.success(`Badge ${selectedBadge.isListed ? "unlisted" : "listed"} successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${action} badge`);
      console.error(`Failed to ${action} badge:`, err);
    } finally {
      setIsConfirmationOpen(false);
      setSelectedBadge(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Badge</TableHead>
            <TableHead>Required XP</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Loading badges...
              </TableCell>
            </TableRow>
          ) : badges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No badges found
              </TableCell>
            </TableRow>
          ) : (
            badges.map((badge) => (
              <TableRow key={badge._id}>
                <TableCell className="flex items-center space-x-3">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${badge.image}`}
                    alt={badge.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{badge.name}</span>
                </TableCell>
                <TableCell>{badge.requiredXp}</TableCell>
                <TableCell>{new Date(badge.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <button
                    onClick={() => handleListUnlist(badge)}
                    className={`px-3 py-1 rounded text-white transition ${
                      badge.isListed
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {badge.isListed ? "Unlist" : "List"}
                  </button>
                  <button
                    onClick={() => onEdit(badge)}
                    className="bg-[#FF9838] text-white px-3 py-1 rounded cursor-pointer hover:bg-[#e67f26] transition"
                  >
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedBadge && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirm}
          badgeName={selectedBadge.name}
          action={action}
        />
      )}
    </>
  );
}