import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch } from "react-redux"
import { logout } from "@/feature/authThunks";

export default function UserHeader() {

  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>();

  function logOut(){
    dispatch(logout());
  }

  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{user?.username
                ? user.username
                .split(" ")
                .slice(0, 2) 
                .map((part) => part.charAt(0).toUpperCase())
                .join(""): ""}
              </AvatarFallback>
            </Avatar>
            <span>{user?.username||"Admin"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem> */}
          <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}