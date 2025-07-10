import { useEffect, useState } from 'react';
import { getOneBySlug, reactToQuestion, removeQuestionReaction } from '@/services/user/user.listQuestion.service';
import { QuestionResponse } from '@/services/user/user.listQuestion.service';
import Header from '@/components/user/Header/Header';
import QuestionHeader from '@/components/user/SingleQuesiotn/QuestionHeader';
import QuestionContent from '@/components/user/SingleQuesiotn/QuestionContent';
import AnswersSection from '@/components/user/SingleQuesiotn/AnswersSection';
import RelatedQuestions from '@/components/user/SingleQuesiotn/RelatedQuestion';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/user/SideBar/SideBar';
import QuestionNotFound from '@/components/user/Default/DefaultQuestion';
import toast from 'react-hot-toast';

export default function SingleQuestionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [questionData, setQuestionData] = useState<QuestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userReaction, setUserReaction] = useState<'upvote' | 'devote' | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

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
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [slug]);

  useEffect(() => {
    if (questionData) {
      setUserReaction(questionData.userReaction);
      setTotalVotes(questionData.totalVotes);
    }
  }, [questionData]);

  const handleReact = async (type: 'upvote' | 'devote') => {
    if (!questionData) return;

    try {
      if (userReaction === type) {
        const message = await removeQuestionReaction(questionData.question._id);
        setUserReaction(null);
        setTotalVotes(prev => type === 'upvote' ? prev - 1 : prev + 1);
        toast.success(message);
      } else {
        const message = await reactToQuestion(questionData.question._id, type);
        if (userReaction === 'upvote') setTotalVotes(prev => prev - 1);
        if (userReaction === 'devote') setTotalVotes(prev => prev + 1);
        setTotalVotes(prev => type === 'upvote' ? prev + 1 : prev - 1);
        setUserReaction(type);
        toast.success(message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading) return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };
  
  if (!questionData) {
    return (
      <QuestionNotFound
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
        setSidebarExpanded={setSidebarExpanded}
      />
    );
  }


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
          <QuestionHeader question={questionData.question} correctAnswer={questionData.correctAnswer??null} />
          <div className="flex flex-1">
            <div className="flex-1">
              <div className={`max-w-3xl ${!sidebarExpanded ? 'pl-6' : ''}`}>
                <QuestionContent 
                  question={questionData.question} 
                  userReaction={userReaction}
                  totalVotes={totalVotes}
                  correctAnswer={questionData.correctAnswer}
                  onReact={handleReact}
                />
                <AnswersSection questionId={questionData.question._id} createdBy={questionData.question.createdBy} />
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