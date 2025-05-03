// components/TaskItem.tsx
'use client'

import { useState } from 'react'

export default function TaskItem({ task }: { task: any }) {
  const [completed, setCompleted] = useState(task.completed)
  
  return (
    <li className={`p-3 border rounded-lg ${completed ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <span className={`${completed ? 'line-through text-gray-500' : 'font-medium'}`}>
          {task.title}
        </span>
        <span className="text-sm text-gray-500">
          {completed ? '✅ Completed' : '🟡 Pending'}
        </span>
      </div>
      {task.createdAt && (
        <p className="text-xs text-gray-400 mt-1">
          Created: {new Date(task.createdAt).toISOString().split('T')[0]}
        </p>
      )}
    </li>
  )
}