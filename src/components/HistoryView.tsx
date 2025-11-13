import { useState, useEffect } from 'react';
import { History, Download, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadData, saveData, exportData, exportCSV, AppData } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const HistoryView = () => {
  const [data, setData] = useState<AppData>(loadData());
  const [editingTask, setEditingTask] = useState<{ date: string; taskId: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editTime, setEditTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setData(loadData());
  }, []);

  const startEdit = (date: string, taskId: string, name: string, timeSpent: number) => {
    setEditingTask({ date, taskId });
    setEditName(name);
    setEditTime((timeSpent / 3600).toFixed(2));
  };

  const saveEdit = () => {
    if (!editingTask || !editName.trim() || !editTime) return;

    const newData = { ...data };
    const tasks = newData.days[editingTask.date].tasks;
    const taskIndex = tasks.findIndex(t => t.id === editingTask.taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        name: editName,
        timeSpent: parseFloat(editTime) * 3600,
      };
      saveData(newData);
      setData(newData);
      setEditingTask(null);
      toast({ title: 'Task updated' });
    }
  };

  const downloadJSON = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusflow-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast({ title: 'Data exported as JSON' });
  };

  const downloadCSV = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusflow-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast({ title: 'Data exported as CSV' });
  };

  const sortedDates = Object.keys(data.days).sort().reverse();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadJSON}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedDates.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No history yet. Start tracking to see your progress!
          </p>
        ) : (
          <div className="space-y-4">
            {sortedDates.map(date => {
              const dayRecord = data.days[date];
              const totalHours = dayRecord.tasks.reduce((sum, task) => sum + task.timeSpent, 0) / 3600;

              return (
                <Card key={date} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        Total: {totalHours.toFixed(2)}h
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {dayRecord.tasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                        >
                          {editingTask?.date === date && editingTask?.taskId === task.id ? (
                            <div className="flex gap-2 flex-1">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1"
                                placeholder="Task name"
                              />
                              <Input
                                type="number"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                className="w-24"
                                placeholder="Hours"
                                step="0.1"
                              />
                              <Button size="icon" onClick={saveEdit}>
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <span className="font-medium">{task.name}</span>
                                <span className="text-sm text-muted-foreground ml-3">
                                  {(task.timeSpent / 3600).toFixed(2)}h
                                </span>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEdit(date, task.id, task.name, task.timeSpent)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
