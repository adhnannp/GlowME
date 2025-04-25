"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { User } from "@/interfaces/auth.interface"

interface UserRowProps {
  user: User
  onBanUser: (user: User) => void
  onUnbanUser: (user: User) => void
}

export default function UserRow({ user, onBanUser, onUnbanUser }: UserRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user.profile_image ? (
            <img
              src={user.profile_image || "/placeholder.svg"}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold">{user.username?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <div>{user.username}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </TableCell>
      <TableCell>{user.xp || 0}</TableCell>
      <TableCell>{user.questions_explored || 0}</TableCell>
      <TableCell>
        {user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A"}
      </TableCell>
      <TableCell className="text-right">
        {user.isBlock ? (
          <Button
            size="sm"
            onClick={() => onUnbanUser(user)}
            className="px-3 py-1 rounded text-white transition bg-green-500 hover:bg-green-600"
          >
            Unban
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onBanUser(user)}
            className="px-3 py-1 rounded text-white transition bg-red-500 hover:bg-red-600"
          >
            Ban
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
