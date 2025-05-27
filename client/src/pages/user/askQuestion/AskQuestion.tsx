import Sidebar from "@/components/user/SideBar/SideBar";
import QuestionForm from "@/components/user/askQuestion/QuestionForm";
import Header from "@/components/user/Header/Header";
import { useState } from "react";

export default function AskQuestionPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleQuestionSubmit = async (data: any) => {
    console.log("Question submitted:", data);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Ask Question"
        setSidebarExpanded={setSidebarExpanded}
      />

      <div className="flex-1 flex flex-col">
        <Header sidebarExpanded={sidebarExpanded} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="min-h-screen">
            <QuestionForm onSubmit={handleQuestionSubmit} />
          </div>  
        </main>
      </div>
    </div>
  );
}