import { ReactNode } from "react"

interface NavItemProps {
  icon: ReactNode;
  label: string;
}

export default function NavItem({ icon, label }: NavItemProps) {
  return (
    <div className="flex items-center px-4 py-3 text-sm rounded-lg">
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </div>
  );
}