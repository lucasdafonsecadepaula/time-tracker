import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodayTasks, saveTodayTasks, Task, getActiveTask, saveActiveTask, ActiveTask } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const TaskTracker = ({ onTimeUpdate }: { onTimeUpdate: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { toast } = useToast();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTasks(getTodayTasks());
    const savedActiveTask = getActiveTask();
    if (savedActiveTask) {
      // Restore active task and calculate elapsed time
      const elapsed = Math.floor((Date.now() - savedActiveTask.startTime) / 1000);
      setTasks(prev => prev.map(task =>
        task.id === savedActiveTask.id
          ? { ...task, timeSpent: task.timeSpent + elapsed }
          : task
      ));
      setActiveTask({ id: savedActiveTask.id, startTime: Date.now() });
    }
  }, []);

  useEffect(() => {
    if (activeTask) {
      intervalRef.current = window.setInterval(() => {
        setTasks(prev => prev.map(task => 
          task.id === activeTask.id 
            ? { ...task, timeSpent: task.timeSpent + 1 }
            : task
        ));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTask]);

  useEffect(() => {
    saveTodayTasks(tasks);
    onTimeUpdate();
  }, [tasks, onTimeUpdate]);

  const addTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      timeSpent: 0,
    };

    setTasks([...tasks, newTask]);
    setNewTaskName('');
    toast({ title: 'Task added', description: `"${newTaskName}" has been created.` });
  };

  const toggleTask = (taskId: string) => {
    const now = Date.now();
    let newTasks = [...tasks];

    if (activeTask) {
      const elapsed = Math.floor((now - activeTask.startTime) / 1000);
      newTasks = newTasks.map(task =>
        task.id === activeTask.id
          ? { ...task, timeSpent: task.timeSpent + elapsed }
          : task
      );
    }

    if (activeTask?.id === taskId) {
      setActiveTask(null);
      saveActiveTask(null);
    } else {
      const newActiveTask = { id: taskId, startTime: now };
      setActiveTask(newActiveTask);
      saveActiveTask(newActiveTask);
    }
    
    setTasks(newTasks);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    if (activeTask?.id === taskId) {
      setActiveTask(null);
      saveActiveTask(null);
    }
    toast({ title: 'Task deleted', variant: 'destructive' });
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditName(task.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    setTasks(tasks.map(t => t.id === editingId ? { ...t, name: editName } : t));
    setEditingId(null);
    setEditName('');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter task name..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask}>Add Task</Button>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <Card key={task.id} className="border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        onBlur={saveEdit}
                        autoFocus
                      />
                    ) : (
                      <h3 className="font-semibold text-lg truncate">{task.name}</h3>
                    )}
                    <p className="text-2xl font-mono text-primary mt-1">
                      {formatTime(task.timeSpent)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant={activeTask?.id === task.id ? 'destructive' : 'default'}
                      onClick={() => toggleTask(task.id)}
                    >
                      {activeTask?.id === task.id ? <Pause /> : <Play />}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => startEdit(task)}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tasks yet. Add one to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
