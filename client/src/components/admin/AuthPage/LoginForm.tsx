import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Eye, EyeOff } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { adminLogin } from "@/feature/authThunks"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: any) => state.auth)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.")
      return
    }

    try {
      const result = await dispatch(adminLogin(formData) as any)
      if (adminLogin.fulfilled.match(result)) {
        toast.success("Login successful!")
        navigate("/admin/users")
      } else {
        toast.error(error ||"Login failed. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.")
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold">Login</h1>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-3 pr-10 py-2 rounded-full"
              value={formData.email}
              onChange={handleChange}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="pl-3 pr-10 py-2 rounded-full"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full rounded-full bg-[#FF9838] hover:bg-[#e88a2f] text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </div>
    </form>
  )
}
