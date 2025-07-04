import { useEffect, useState } from 'react';
import { getOneBySlug } from '@/services/user/user.listQuestion.service';
import { QuestionResponse } from '@/services/user/user.listQuestion.service';
import Header from '@/components/user/Header/Header';
import QuestionHeader from '@/components/user/SingleQuesiotn/QuestionHeader';
import QuestionContent from '@/components/user/SingleQuesiotn/QuestionContent';
import AnswersSection from '@/components/user/SingleQuesiotn/AnswersSection';
import RelatedQuestions from '@/components/user/SingleQuesiotn/RelatedQuestion';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/user/SideBar/SideBar';

export default function SingleQuestionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [questionData, setQuestionData] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }
      try {
        const data = await getOneBySlug(slug);
        setQuestionData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!questionData) return <div>No question found</div>;

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

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
        <div className={`p-6 overflow-y-auto ${!sidebarExpanded ? 'pl-18' : ''}`}>
          <QuestionHeader question={questionData.question} />
          <div className="flex flex-1">
            <div className="flex-1">
              <div className={`max-w-3xl ${!sidebarExpanded ? 'pl-6' : ''}`}>
                <QuestionContent question={questionData.question} />
                <AnswersSection questionId={questionData.question._id} />
              </div>
            </div>
            <div className="w-80 pl-6">
              <RelatedQuestions questionId={questionData.question._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}