import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Plus className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-lg"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="absolute right-2 top-2 bottom-2 bg-primary text-white px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-primary transition-all text-sm"
      >
        Add
      </button>
    </form>
  );
};
