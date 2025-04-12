import { TableCell , TableRow} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { User } from "@/interfaces/auth.interface"

interface RowProps {
  user: User
  onBlockToggle: (userId: string, currentBlockStatus: boolean) => void
}

export default function UserRow({ user, onBlockToggle }: UserRowProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user.profile_image} />
            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.xp?.toLocaleString()}</TableCell>
      <TableCell>{user.questions_explored}</TableCell>
      <TableCell>{formatDate(user.created_at!)}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <Button
            onClick={() => onBlockToggle(user._id, user.isBlock!)}
            className={
              user.isBlock
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }
            size="sm"
          >
            {user.isBlock ? "Unblock" : "Block"}
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5 text-[#FF9838]" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}