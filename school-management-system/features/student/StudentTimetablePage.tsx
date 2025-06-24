
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { TimetableEntry } from '../../types';
import { getStudentTimetable } from '../../services/mockData';
import { Icons } from '../../constants';

interface StudentTimetablePageProps {
  studentClassId: string;
}

const StudentTimetablePage: React.FC<StudentTimetablePageProps> = ({ studentClassId }) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSchedule(getStudentTimetable(studentClassId));
      setLoading(false);
    }, 300);
  }, [studentClassId]);

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
      <h1 className="text-3xl font-bold text-gray-800">My Class Schedule</h1>
      {schedule.length > 0 ? (
        <div className="space-y-8">
          {daysOrder.map(day => {
            const dayEntries = dailySchedule[day];
            if (!dayEntries || dayEntries.length === 0) return null; // Skip days with no classes

            return (
              <Card key={day} title={day} className="shadow-lg">
                <ul className="divide-y divide-gray-200">
                  {dayEntries.sort((a,b) => a.time.localeCompare(b.time)).map((entry, index) => (
                    <li key={index} className="py-4 px-2 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div className="mb-2 sm:mb-0">
                          <p className="text-md font-semibold text-academic-blue">{entry.time}</p>
                          <p className="text-lg text-gray-800">{entry.subject}</p>
                          {entry.teacherName && <p className="text-sm text-gray-500">Teacher: {entry.teacherName}</p>}
                        </div>
                        {entry.room && (
                          <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
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
          <div className="text-center py-12">
            <Icons.Timetable className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Your timetable is not available or you have no classes scheduled.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentTimetablePage;
