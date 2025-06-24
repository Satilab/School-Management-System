import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { SchoolEvent, UserRole } from '../../types';
import { mockEvents } from '../../services/mockData';
import { Icons } from '../../constants';

const StudentEventsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentEvents, setStudentEvents] = useState<SchoolEvent[]>([]);

  useEffect(() => {
    setLoading(true);
    // Filter events relevant to students
    const relevantEvents = mockEvents.filter(event => 
      event.audience?.includes(UserRole.STUDENT) || event.audience?.includes(UserRole.ADMIN) // Assuming admin events are for all
    ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setStudentEvents(relevantEvents);
    setLoading(false);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">School Events Calendar</h1>

      {studentEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentEvents.map(event => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className={`p-1 rounded-t-md ${
                event.type === 'Exam' ? 'bg-red-500' : 
                event.type === 'Holiday' ? 'bg-green-500' :
                event.type === 'Activity' ? 'bg-blue-500' :
                event.type === 'Seminar' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  {event.type === 'Exam' && <Icons.Grades className="w-4 h-4 mr-2 text-red-600"/>}
                  {event.type === 'Holiday' && <Icons.Events className="w-4 h-4 mr-2 text-green-600"/>}
                  {event.type === 'Activity' && <Icons.Students className="w-4 h-4 mr-2 text-blue-600"/>}
                  {event.type === 'Seminar' && <Icons.Teachers className="w-4 h-4 mr-2 text-yellow-600"/>}
                  {event.type === 'Meeting' && <Icons.Communication className="w-4 h-4 mr-2 text-gray-600"/>}
                  <span>{event.type}</span>
                   <span className="mx-1">&bull;</span>
                  <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <h3 className="text-lg font-semibold text-academic-blue-dark mb-1">{event.title}</h3>
                {event.description && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>}
                {event.rsvp && (
                  <button className="text-xs bg-accent-yellow text-white px-2 py-1 rounded hover:bg-accent-yellow-dark">RSVP Now</button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-8">No upcoming events scheduled for students at this time.</p>
        </Card>
      )}
    </div>
  );
};

export default StudentEventsPage;
