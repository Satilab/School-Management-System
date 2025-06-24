import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { mockAssignments, mockEvents, getTeacherById, getTeacherTimetable } from '../../services/mockData';
import { Assignment, SchoolEvent, Teacher, TimetableEntry, UserRole } from '../../types';
import Modal from '../../components/ui/Modal';
import { Link }
from 'react-router-dom';

interface TeacherOverviewContentProps {
  teacherId: string;
}

const TeacherOverviewContent: React.FC<TeacherOverviewContentProps> = ({ teacherId }) => {
  const [loading, setLoading] = useState(true);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<TimetableEntry[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<SchoolEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const teacher = getTeacherById(teacherId);
    if(teacher){
        setCurrentTeacher(teacher);
        setUpcomingAssignments(mockAssignments.filter(a => a.teacherId === teacherId && new Date(a.dueDate) > new Date()).slice(0, 3));
        
        const fullSchedule = getTeacherTimetable(teacherId);
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as TimetableEntry['day'];
        setTodaySchedule(fullSchedule.filter(item => item.day === today).sort((a,b) => a.time.localeCompare(b.time)));
        
        setUpcomingEvents(mockEvents.filter(e => new Date(e.date) >= new Date() && (e.audience?.includes(UserRole.TEACHER) || e.audience?.includes(UserRole.ADMIN))).slice(0,3));

    }
    setLoading(false);
  }, [teacherId]);

  const CreateAssignmentForm: React.FC = () => (
    // This form is simplified here. The full form is in TeacherAssignmentsPage.
    <form className="space-y-4">
      <p className="text-sm text-gray-600">Please go to the <Link to="/teacher/assignments" className="text-academic-blue hover:underline">Assignments page</Link> to create a new assignment with full options.</p>
      <div>
        <label htmlFor="assignmentTitle" className="block text-sm font-medium text-gray-700">Title (Quick Add)</label>
        <input type="text" id="assignmentTitle" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-academic-blue focus:border-academic-blue sm:text-sm" />
      </div>
      <Button type="submit" variant="primary" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); alert("Quick add assignment (mock). Use Assignments page for full creation.") }}>Quick Add</Button>
    </form>
  );

  if (loading || !currentTeacher) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentTeacher.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card title="Today's Schedule">
          {todaySchedule.length > 0 ? (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {todaySchedule.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-academic-blue">{item.time}</span>
                  <span className="text-sm text-gray-700">{item.subject} ({item.className})</span>
                  {item.room && <span className="text-xs text-gray-500">Room: {item.room}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No classes scheduled for today.</p>
          )}
           <Link to="/teacher/timetable">
            <Button variant="ghost" size="sm" className="mt-3 w-full">View Full Timetable</Button>
           </Link>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link to="/teacher/attendance" className="block"><Button variant="primary" className="w-full">Mark Attendance</Button></Link>
            <Button variant="secondary" className="w-full" onClick={() => setIsModalOpen(true)}>Create Assignment (Quick)</Button>
            <Link to="/teacher/grades" className="block"><Button variant="outline" className="w-full">Enter Grades</Button></Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <div className="lg:col-span-2">
            <Card title="Your Upcoming Assignments Due">
            {upcomingAssignments.length > 0 ? (
                <ul className="space-y-3 max-h-72 overflow-y-auto">
                {upcomingAssignments.map(assignment => (
                    <li key={assignment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-academic-blue-dark">{assignment.title}</h4>
                        <span className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">{assignment.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Subject: {assignment.subject} | Classes: {assignment.classIds.join(', ')}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-500">No upcoming assignments created by you.</p>
            )}
             <Link to="/teacher/assignments">
                <Button variant="ghost" size="sm" className="mt-3 w-full">View All Assignments</Button>
            </Link>
            </Card>
        </div>

        {/* School Events */}
        <Card title="Upcoming School Events">
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {upcomingEvents.map(event => (
                <div key={event.id} className="py-2 border-b last:border-b-0">
                  <h4 className="font-medium text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} - {event.type}</p>
                </div>
              ))}
            </ul>
            ) : (
                 <p className="text-gray-500">No upcoming events relevant to you.</p>
            )}
          {/* Link to a full events page if one exists for teachers */}
        </Card>
      </div>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment (Quick Add)">
        <CreateAssignmentForm />
      </Modal>
    </div>
  );
};

export default TeacherOverviewContent;
