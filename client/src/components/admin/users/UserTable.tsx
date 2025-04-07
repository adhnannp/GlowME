import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import UserRow from "./UserRow"
import { User } from "@/interfaces/auth.interface"

interface UserTableProps {
  users: User[]
  loading: boolean
  onBlockToggle: (userId: string, currentBlockStatus: boolean) => void
}

export default function UserTable({ users, loading, onBlockToggle }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">User name</TableHead>
          <TableHead>XP</TableHead>
          <TableHead>Questions Explored</TableHead>
          <TableHead>Joining date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading users...
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <UserRow key={user._id} user={user} onBlockToggle={onBlockToggle} />
          ))
        )}
      </TableBody>
    </Table>
  )
}