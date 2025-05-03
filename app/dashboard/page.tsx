'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (status !== 'authenticated') return;
        
        const res = await fetch('/api/tasks');
        if (!res.ok) throw new Error('Error al cargar tareas');
        
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error al cargar tareas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [status]);

  const handleDelete = async (taskId: string) => {
    if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Error al eliminar');
        
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Error al eliminar tarea');
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-900 font-bold"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tus Tareas</h1>
        <Link 
          href="/tasks/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Nueva Tarea
        </Link>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tienes tareas aún</p>
          <Link 
            href="/tasks/new" 
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Crear primera tarea
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <span className={`flex-1 ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                {task.title}
              </span>
              <div className="flex space-x-2">
                <Link 
                  href={`/tasks/${task.id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}