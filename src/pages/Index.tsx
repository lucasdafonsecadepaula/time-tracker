import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock } from '@/components/Clock';
import { TaskTracker } from '@/components/TaskTracker';
import { ReminderManager } from '@/components/ReminderManager';
import { HistoryView } from '@/components/HistoryView';
import { getTodayTasks, getTheme, saveTheme } from '@/utils/storage';

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());
  const [totalTimeToday, setTotalTimeToday] = useState(0);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    updateTotalTime();
  }, []);

  const updateTotalTime = () => {
    const tasks = getTodayTasks();
    const total = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
    setTotalTimeToday(total);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background">
      <Clock totalTimeToday={totalTimeToday} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">FocusFlow</h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TaskTracker onTimeUpdate={updateTotalTime} />
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderManager />
          </TabsContent>

          <TabsContent value="history">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
