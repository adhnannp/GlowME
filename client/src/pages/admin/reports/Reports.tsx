import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/admin/SideBar/Sidebar";
import UsersReport from "@/components/admin/Reports/UserReport";
import QuestionsReport from "@/components/admin/Reports/QuestionsReport";
import AnswersReport from "@/components/admin/Reports/AnswersReport";
import UserHeader from "@/components/admin/users/UserHeader";

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Reports</h1>
          <div className="flex items-center space-x-4">
              <UserHeader />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Reported Items</h2>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:border-[#FF4747] data-[state=active]:text-[#FF4747] border-b-2 border-transparent rounded-none"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="questions"
                  className="data-[state=active]:border-[#47B5FF] data-[state=active]:text-[#47B5FF] border-b-2 border-transparent rounded-none"
                >
                  Questions <Badge className="ml-2 bg-gray-200 text-gray-700">3</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="answers"
                  className="data-[state=active]:border-[#A47AFF] data-[state=active]:text-[#A47AFF] border-b-2 border-transparent rounded-none"
                >
                  Answers <Badge className="ml-2 bg-gray-200 text-gray-700">2</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6 space-y-4">
                <UsersReport />
              </TabsContent>
              <TabsContent value="questions" className="mt-6 space-y-4">
                <QuestionsReport />
              </TabsContent>
              <TabsContent value="answers" className="mt-6 space-y-4">
                <AnswersReport />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}