import React, { useState, useEffect, useCallback } from 'react';
import { FilterType, Task, Subtask } from './types';
import { AddTodo } from './components/AddTodo';
import { TodoItem } from './components/TodoItem';
import { suggestSubtasks } from './services/gemini';
import { LayoutList, CheckCircle2, Circle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('gemini-todo-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tasks', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('gemini-todo-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleAiExpand = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Set loading state
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isExpanding: true } : t));

    try {
      const suggestions = await suggestSubtasks(task.text);
      
      const subtasks: Subtask[] = suggestions.map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false
      }));

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, subtasks, isExpanding: false } : t
      ));
    } catch (error) {
      console.error("Error expanding task:", error);
      // Revert loading state on error
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isExpanding: false } : t));
      alert("Failed to generate subtasks. Please check your API key or try again.");
    }
  }, [tasks]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      
      const updatedSubtasks = t.subtasks?.map(s => 
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      );
      
      return { ...t, subtasks: updatedSubtasks };
    }));
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;

  if (isLoading) return null;

  return (
    <div className="min-h-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-screen">
      
      {/* Header */}
      <header className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Gemini Powered</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tasks
        </h1>
        <p className="text-slate-500">
          You have <span className="font-semibold text-primary">{activeCount}</span> active tasks remaining.
        </p>
      </header>

      {/* Input */}
      <div className="mb-8 z-10 sticky top-4">
        <AddTodo onAdd={addTask} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap capitalize ${
              filter === f
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20 pr-1">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            {filter === 'all' && tasks.length === 0 ? (
              <>
                <LayoutList className="w-16 h-16 mb-4 opacity-50" />
                <p>No tasks yet. Add one above!</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-16 h-16 mb-4 opacity-50" />
                <p>No {filter} tasks found.</p>
              </>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onExpand={handleAiExpand}
              onToggleSubtask={toggleSubtask}
            />
          ))
        )}
      </div>
      
    </div>
  );
};

export default App;
