"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TaskCompletionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estado actual
  useEffect(() => {
    const loadCompletionStatus = async () => {
      try {
        const res = await fetch(`/api/tasks/${id}/completion`);
        
        if (!res.ok) throw new Error('Error al cargar estado');
        
        const data = await res.json();
        setIsCompleted(data.completed);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar tarea');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletionStatus();
  }, [id]);

  // Actualizar estado
  const handleToggle = async () => {
    try {
      const newStatus = !isCompleted;
      setIsLoading(true);
      
      const res = await fetch(`/api/tasks/${id}/completion`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newStatus })
      });

      if (!res.ok) throw new Error('Error al guardar');
      
      setIsCompleted(newStatus);
      toast.success(`Estado actualizado: ${newStatus ? 'Completada' : 'Pendiente'}`);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Cambiar estado de tarea #{id}</h1>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700">
            Estado actual: 
            <span className={`ml-2 font-semibold ${
              isCompleted ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {isCompleted ? 'Completada' : 'Pendiente'}
            </span>
          </span>
          
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
              isCompleted ? 'bg-green-500' : 'bg-gray-300'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <span className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
              isCompleted ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}