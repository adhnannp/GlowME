import { ReactNode } from "react"

interface NavItemProps {
  icon: ReactNode
  label: string
  active?: boolean
}

export default function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      className={`flex items-center px-4 py-3 text-sm rounded-lg ${
        active
          ? "bg-[#FF9838] bg-opacity-10 text-[#ffffff] font-bold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </a>
  )
}