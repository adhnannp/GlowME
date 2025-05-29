import Sidebar from "@/components/user/SideBar/SideBar";
import QuestionForm from "@/components/user/askQuestion/QuestionForm";
import Header from "@/components/user/Header/Header";
import { useState } from "react";
import { QuestionFormData } from "@/validations/question/questionSchema";
import { createQuestion } from "@/services/user/user.AddQuestion.service";

export default function AskQuestionPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleQuestionSubmit = async (data: QuestionFormData) => {
    console.log("Question submitted:", data);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("problemDetails", data.problemDetails);
      formData.append("isBounty", String(data.isBounty));
      formData.append("bountyCoins", String(data.bountyCoins));
      formData.append("tags", JSON.stringify(data.tags));
      if (data.image) {
        formData.append("image", data.image, data.image.name);
      }
      if (data.document) {
        formData.append("document", data.document, data.document.name);
      }
      const response = await createQuestion(formData)
      console.log("Question created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error instanceof Error ? error : new Error("Failed to create question");
    }
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