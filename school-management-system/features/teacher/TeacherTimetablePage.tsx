
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { TimetableEntry } from '../../types';
import { getTeacherTimetable } from '../../services/mockData';
import { Icons } from '../../constants';

interface TeacherTimetablePageProps {
  teacherId: string;
}

const TeacherTimetablePage: React.FC<TeacherTimetablePageProps> = ({ teacherId }) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSchedule(getTeacherTimetable(teacherId));
      setLoading(false);
    }, 300);
  }, [teacherId]);

  const groupScheduleByDay = (scheduleItems: TimetableEntry[]) => {
    return scheduleItems.reduce((acc, item) => {
      const day = item.day;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {} as Record<string, TimetableEntry[]>);
  };

  const daysOrder: TimetableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) return <Spinner />;

  const dailySchedule = groupScheduleByDay(schedule);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Timetable</h1>
      {schedule.length > 0 ? (
        <div className="space-y-8">
          {daysOrder.map(day => {
            const dayEntries = dailySchedule[day];
            if (!dayEntries || dayEntries.length === 0) return null;
            return (
              <Card key={day} title={day} className="shadow-lg">
                <ul className="space-y-3">
                  {dayEntries.sort((a,b) => a.time.localeCompare(b.time)).map((entry, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div className="mb-2 sm:mb-0">
                          <p className="text-lg font-semibold text-academic-blue">{entry.time}</p>
                          <p className="text-md text-gray-700">{entry.subject} - Class {entry.className}</p>
                        </div>
                        {entry.room && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Icons.Classes className="w-4 h-4 mr-1 text-gray-400"/> Room: {entry.room}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">Your timetable is not available at the moment.</p>
        </Card>
      )}
    </div>
  );
};

export default TeacherTimetablePage;
