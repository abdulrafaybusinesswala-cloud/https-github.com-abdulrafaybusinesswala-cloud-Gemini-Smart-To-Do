import React from 'react';
import { Trash2, Check, Sparkles, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, Subtask } from '../types';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onExpand: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ 
  task, 
  onToggle, 
  onDelete, 
  onExpand,
  onToggleSubtask
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(!!task.subtasks && task.subtasks.length > 0);

  // Automatically open details if subtasks are added (e.g. via AI)
  React.useEffect(() => {
    if (task.subtasks && task.subtasks.length > 0) {
      setIsDetailsOpen(true);
    }
  }, [task.subtasks?.length]);

  return (
    <div className={`group bg-white rounded-xl border transition-all duration-200 ${task.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-primary/30 hover:shadow-md'}`}>
      <div className="flex items-center p-4 gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-slate-300 text-transparent hover:border-primary'
          }`}
        >
          <Check size={14} strokeWidth={3} />
        </button>

        {/* Text */}
        <span 
          className={`flex-grow text-lg transition-all ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'
          }`}
        >
          {task.text}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
           {/* AI Expand Button - Only show if not completed and no subtasks yet */}
           {!task.completed && (!task.subtasks || task.subtasks.length === 0) && (
            <button
              onClick={() => onExpand(task.id)}
              disabled={task.isExpanding}
              className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors relative"
              title="Break down with AI"
            >
               {task.isExpanding ? (
                 <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <Sparkles size={20} />
               )}
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Subtasks Section */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 rounded-b-xl overflow-hidden">
             <div 
               className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
               onClick={() => setIsDetailsOpen(!isDetailsOpen)}
             >
                {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} Subtasks</span>
             </div>
             
             {isDetailsOpen && (
               <div className="p-2 space-y-1">
                 {task.subtasks.map((subtask: Subtask) => (
                   <div 
                     key={subtask.id} 
                     className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer group/sub"
                     onClick={() => onToggleSubtask(task.id, subtask.id)}
                   >
                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                       subtask.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300'
                     }`}>
                       {subtask.completed && <Check size={10} />}
                     </div>
                     <span className={`text-sm ${subtask.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                       {subtask.text}
                     </span>
                   </div>
                 ))}
               </div>
             )}
        </div>
      )}
    </div>
  );
};
