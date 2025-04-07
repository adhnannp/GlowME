import { useState, useEffect } from "react"
import api from "@/utils/axios"
import Sidebar from "@/components/admin/SideBar/Sidebar"
import UserTable from "@/components/admin/users/UserTable"
import SearchBar from "@/components/admin/users/SearchBar"
import UserHeader from "@/components/admin/users/UserHeader"
import { User } from "@/interfaces/auth.interface"
import Pagination from "@/components/admin/users/Pagination"

export interface ApiResponse {
  message: string
  users: User[]
  page: number
  totalPages?: number
  totalUsers?: number
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const fetchUsers = async (page: number = 1) => {
    setLoading(true)
    try {
      const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      const response = await api.get(`/admin/users?page=${page}${searchQuery}`)
      
      const data: ApiResponse = await response.data
      
      setUsers(data.users)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages || Math.ceil(data.users.length / 10))
      setTotalUsers(data.totalUsers || data.users.length)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to fetch users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage, searchTerm])

  const toggleBlockStatus = async (userId: string, currentBlockStatus: boolean) => {
    try {
      const response = await api.post(`/admin/users/${userId}/toggle-block`)

      if (!response.ok) {
        throw new Error(`Failed to ${currentBlockStatus ? 'unblock' : 'block'} user`)
      }

      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlock: !currentBlockStatus } : user
      ))
    } catch (err) {
      console.error(`Error toggling block status: ${err}`)
      setError(err instanceof Error ? err.message : "Failed to update user status")
    }
  }

  return (
    <div className="flex h-screen bg-[#FFF8F0]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FFF8F0] border-b p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">User tables</h1>
          <div className="flex items-center space-x-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <UserHeader />
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-gray-500 text-sm mt-1">
                  All the users that are registered on your store are displayed in data tables with some of their basic
                  information and history.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="rounded-lg border overflow-hidden">
              <UserTable 
                users={users} 
                loading={loading} 
                onBlockToggle={toggleBlockStatus} 
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUsers}
              itemsPerPage={8}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  )
}