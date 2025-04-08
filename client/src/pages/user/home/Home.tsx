import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import TabButton from "@/components/user/home/TabButton"
import QuestionCard from "@/components/user/home/QuestionCard"
import Sidebar from "@/components/user/SideBar/SideBar"
import Header from "@/components/user/Header/Header"

// Sample question data
const questions = [
  {
    id: 1,
    title: "The full Executive Order is out! ⚠️ This is the biggest executive power grab in U.S. history.⚠️",
    timeAgo: "1 hr. ago",
    votes: "17K",
    comments: "2.7K",
    tag: "BonusQ",
    image: "/Animation - 1741701078258.gif",
  },
  {
    id: 2,
    title: "The full Executive Order is out! ⚠️ This is the biggest executive power grab in U.S. history.⚠️",
    timeAgo: "1 hr. ago",
    votes: "17K",
    comments: "2.7K",
    tag: "tag",
    image: "/Animation - 1741701078258.gif",
  },
  {
    id: 3,
    title: "The full Executive Order is out! ⚠️ This is the biggest executive power grab in U.S. history.⚠️",
    timeAgo: "1 hr. ago",
    votes: "17K",
    comments: "2.7K",
    tag: "tag",
    image: "/Animation - 1741701078258.gif",
  },
]

const tags = ["css", "express", "html", "javascript", "jquery", "mongodb", "node.js", "reactjs", "sass"]

export default function QuestionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Sidebar
        sidebarExpanded={sidebarExpanded}
        activePage="Home"
        setSidebarExpanded={setSidebarExpanded}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        {/* Questions Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">20,202 questions Asked</h1>
                <p className="text-gray-600">Find answers to your technical questions and help others answer theirs.</p>
              </div>
              <Button variant="default" className="bg-black text-white hover:bg-black/90">
                Ask Question
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
              <TabButton active>All</TabButton>
              <TabButton active={false}>surveyQ</TabButton>
              <TabButton active={false}>ChoiceQ</TabButton>
              <TabButton active={false}>descriptiveQ</TabButton>
            </div>

            <div className="flex gap-6">
              {/* Questions Feed */}
              <div className="flex-1 space-y-4">
                {questions.map((question) => (
                  <QuestionCard key={question.id} {...question} />
                ))}
                <div className="text-center py-4">
                  <Button variant="outline" className="w-full">
                    Load Questions
                  </Button>
                </div>
              </div>

              {/* Tags Sidebar */}
              <div className="w-80 shrink-0">
                <div className="border rounded-lg p-4">
                  <h2 className="font-medium mb-3">tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input placeholder="Filter order numb" className="flex-1" />
                    <Button variant="default" className="bg-black text-white hover:bg-black/90">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

