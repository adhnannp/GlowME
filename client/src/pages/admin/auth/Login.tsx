import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFF8F0]">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Left side - Login form */}
        <div className="w-full p-8 md:w-1/2">
          <div className="mb-8">
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6 rounded-full bg-[#FF9838]"></div>
              <span className="text-lg font-medium">GlowME</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
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
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-[#FF9838] hover:underline">
                    Forget password
                  </a>
                </div>
              </div>

              <Button className="w-full rounded-full bg-[#FF9838] hover:bg-[#e88a2f] text-white">Log in</Button>
            </div>
          </div>
        </div>

        <div className="hidden relative bg-[#FF9838] md:flex md:w-1/2 flex-col justify-center items-center text-white p-8">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ffb06b] opacity-50 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-[#ffb06b] opacity-50 -mr-10 -mb-10"></div>

          <div className="z-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Hey</h2>
            <h2 className="text-3xl font-bold mb-2">Welcome</h2>
            <h2 className="text-3xl font-bold">Back</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

