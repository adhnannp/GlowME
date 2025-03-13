import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
  Bell,
  Users,
  MessageSquare,
  Bookmark,
  PlusCircle,
  User,
  InfoIcon as About,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SidebarItem from "@/components/user/Profile/SideBarItem"
import TabButton from "@/components/home/TabButton"
import QuestionCard from "@/components/home/QuestionCard"

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
      <div
        className={`${sidebarExpanded ? "w-[186px]" : "w-[60px]"} border-r flex flex-col transition-all duration-300 ease-in-out relative`}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h1 className={`text-xl font-bold ${sidebarExpanded ? "block" : "hidden"}`}>GlowME</h1>
          <button
            onClick={toggleSidebar}
            className={`absolute ${sidebarExpanded ? "right-2" : "right-1/2 translate-x-1/2"} top-5 p-1 rounded-full hover:bg-gray-100`}
          >
            {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1">
          <nav className="space-y-1 py-2">
            <SidebarItem icon={<Home className="h-5 w-5" />} label="Home" active={false} expanded={sidebarExpanded} />
            <SidebarItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="Questions"
              active={true}
              expanded={sidebarExpanded}
            />
            <SidebarItem icon={<Bell className="h-5 w-5" />} label="Notifications" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<Users className="h-5 w-5" />} label="Connect" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<MessageSquare className="h-5 w-5" />} label="Social" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<Bookmark className="h-5 w-5" />} label="saved" active={false} expanded={sidebarExpanded} />
            <SidebarItem icon={<PlusCircle className="h-5 w-5" />} label="Ask Question" active={false} expanded={sidebarExpanded} />
          </nav>
        </div>

        <div className="mt-auto border-t">
          <SidebarItem icon={<User className="h-5 w-5" />} label="Profile" active={false} expanded={sidebarExpanded} />
          <SidebarItem icon={<About className="h-5 w-5" />} label="more" active={false} expanded={sidebarExpanded} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b p-3 flex items-center">
          <div className="flex-1">
            <input type="text" placeholder="Search..." className="w-full border rounded-md px-3 py-2" />
          </div>
          <div className="ml-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
          </div>
        </header>

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

