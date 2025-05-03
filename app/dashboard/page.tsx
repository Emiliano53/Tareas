// app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import TaskItem from "@/components/TaskItem"

const prisma = new PrismaClient()

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { tasks: true }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {session.user.email}!</h1>
        <p className="text-gray-600">You have {user.tasks.length} tasks</p>
      </header>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        
        {user.tasks.length > 0 ? (
          <ul className="space-y-3">
            {user.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
            <a 
              href="/tasks/new" 
              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Task
            </a>
          </div>
        )}
      </section>
    </div>
  )
}