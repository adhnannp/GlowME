import LoginHeader from "@/components/admin/AuthPage/LoginHeader"
import LoginForm from "@/components/admin/AuthPage/LoginForm"
import LoginRightBanner from "@/components/admin/AuthPage/LoginRightBanner"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#FFF8F0]">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="w-full p-8 md:w-1/2">
          <LoginHeader />
          <LoginForm />
        </div>
        <LoginRightBanner />
      </div>
    </div>
  )
}
