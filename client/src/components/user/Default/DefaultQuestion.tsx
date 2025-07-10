import Sidebar from '@/components/user/SideBar/SideBar';
import Header from '@/components/user/Header/Header';
import { HelpCircle } from 'lucide-react';

interface Props {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
}

export default function QuestionNotFound({ sidebarExpanded, toggleSidebar, setSidebarExpanded }: Props) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Home"
        setSidebarExpanded={setSidebarExpanded}
      />
      <div className="flex-1 flex flex-col">
        <Header
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex flex-col items-center justify-center flex-1 text-gray-600">
          <HelpCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold">No question found</p>
        </div>
      </div>
    </div>
  );
}
