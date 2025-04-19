import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"

export interface Badge {
  _id: string
  name: string
  image: string;
  requiredXp: number
  created_at: string
  updated_at: string
}

interface BadgeTableProps {
  badges: Badge[]
  loading: boolean
  onEdit: (badge: Badge) => void
}

export default function BadgeTable({ badges, loading, onEdit }: BadgeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Badge</TableHead>
          <TableHead>Required XP</TableHead>
          <TableHead>Created At</TableHead>
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
                <img src={`http://localhost:3000${badge.image}`} alt={badge.name} className="w-8 h-8 rounded-full object-cover" />
                <span>{badge.name}</span>
              </TableCell>
              <TableCell>{badge.requiredXp}</TableCell>
              <TableCell>{new Date(badge.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onEdit(badge)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
