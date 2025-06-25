import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuestionCard from "@/components/user/home/QuestionCard";
import Sidebar from "@/components/user/SideBar/SideBar";
import Header from "@/components/user/Header/Header";
import { useNavigate } from "react-router-dom";
import TabButton from "@/components/user/home/TabButton";
import { fetchQuestionByType } from "@/services/user/user.listQuestion.service";
import { UserWithBadge } from "@/interfaces/auth.interface";
import { Tag } from "@/interfaces/user.tag.interface";

interface QuestionAPIResponse {
  questions: {
    _id: string;
    slug: string;
    title: string;
    created_at: string;
    voteScore: number;
    answerCount: number;
    tags: Tag[];
    header_image: string;
    createdBy: UserWithBadge;
  }[];
  skip: number;
  total: number;
  limit: number;
  message: string;
  page: number;
}

const tags = ["css", "express", "html", "javascript", "jquery", "mongodb", "node.js", "reactjs", "sass"];

export default function QuestionsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [questions, setQuestions] = useState<QuestionAPIResponse["questions"] | null>(null);
  const [page, setPage] = useState(1);
  const [qType, setQType] = useState("descriptive");
  const [hasMore, setHasMore] = useState(true);
  const [total,setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialQuestions = async () => {
      try {
        const data = await fetchQuestionByType(1, qType);
        setQuestions(data.questions);
        setPage(data.page + 1);
        setHasMore((data.page * data.limit) < data.total);
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching initial questions:", error);
      }
    };
    fetchInitialQuestions();
  }, [qType]);

  const handleLoadMore = async () => {
    try {
      const data = await fetchQuestionByType(page, qType);
      if (data.questions.length > 0) {
        setQuestions((prevQuestions) => (prevQuestions ? [...prevQuestions, ...data.questions] : data.questions));
        setPage(data.page + 1);
        setHasMore((data.page * data.limit) < data.total);
        setTotal(data.total) 
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more questions:", error);
    }
  };

  const handleTabChange = (type: string) => {
    setQType(type);
    setPage(1); 
    setHasMore(true); 
    setQuestions(null);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  };

  const mappedQuestions = questions
    ? questions.map((question) => ({
        _id: question._id,
        slug: question.slug,
        title: question.title,
        created_at: question.created_at,
        voteScore: question.voteScore,
        answerCount: question.answerCount,
        tags: question.tags,
        header_image: question.header_image,
        createdBy: question.createdBy,
      }))
    : [];

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
        {/* Questions Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                   {total} {qType} questions Asked
                </h1>
                <p className="text-gray-600">
                  Find answers to your technical questions and help others answer theirs.
                </p>
              </div>
              <Button
                variant="default"
                className="bg-black text-white hover:bg-black/90"
                onClick={() => navigate("/ask-question")}
              >
                Ask Question
              </Button>
            </div>

            <div className="flex space-x-4 mb-6 border-b">
              <TabButton
                active={qType === "descriptive"}
                onClick={() => handleTabChange("descriptive")}
              >
                descriptiveQ
              </TabButton>
              <TabButton
                active={qType === "bounty"}
                onClick={() => handleTabChange("bounty")}
              >
                BountyQ
              </TabButton>
            </div>

            <div className="flex gap-6">
              {/* Questions Feed */}
              <div className="flex-1 space-y-4">
                {mappedQuestions.length > 0 ? (
                  mappedQuestions.map((question) => (
                    <QuestionCard key={question._id} {...question} />
                  ))
                ) : (
                  <div className="text-center py-4">No questions found.</div>
                )}
                {hasMore && (
                  <div className="text-center py-4">
                    <Button variant="outline" className="w-full" onClick={handleLoadMore}>
                      Load More
                    </Button>
                  </div>
                )}
              </div>

              <div className="w-80 shrink-0">
                <div className="border rounded-lg p-4">
                  <h2 className="font-medium mb-3">tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input placeholder="Filter order numb" className="flex-1" />
                    <Button
                      variant="default"
                      className="bg-black text-white hover:bg-black/90"
                    >
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
  );
}