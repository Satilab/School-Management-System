
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { mockStudents, mockAssignments, mockAnnouncements } from '../../services/mockData';
import { Assignment, Announcement as AnnouncementType, Student, UserRole } from '../../types'; 
import AnnouncementsList from '../shared/AnnouncementsList';
import Button from '../../components/ui/Button';

interface StudentOverviewContentProps {
  studentName: string; 
}

const StudentOverviewContent: React.FC<StudentOverviewContentProps> = ({ studentName }) => {
  const [loading, setLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<AnnouncementType[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const student = mockStudents.find(s => s.name === studentName);
      if (student) {
        setCurrentStudent(student);
        setUpcomingAssignments(mockAssignments.filter(a => student.classId && a.classIds.includes(student.classId) && new Date(a.dueDate) > new Date()).slice(0, 2));
      } else {
        setCurrentStudent(mockStudents.find(s => s.id === 'S005') || mockStudents[0]); // Fallback to "Student Jane" or first student
        const fallbackStudent = mockStudents.find(s => s.id === 'S005') || mockStudents[0];
        setUpcomingAssignments(mockAssignments.filter(a => fallbackStudent.classId && a.classIds.includes(fallbackStudent.classId) && new Date(a.dueDate) > new Date()).slice(0, 2));
      }
      
      setRecentAnnouncements(mockAnnouncements.filter(an => an.roleAudience.includes(UserRole.STUDENT)).slice(0,3));
      setLoading(false);
    }, 500);
  }, [studentName]); 

  if (loading || !currentStudent) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentStudent.name}!</h1>
      <p className="text-gray-600">Class: {currentStudent.class}{currentStudent.section} | Roll No: {currentStudent.rollNumber}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Attendance" className="md:col-span-1">
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`text-5xl font-bold ${currentStudent.attendance && currentStudent.attendance >= 90 ? 'text-accent-green' : 'text-accent-yellow'}`}>
              {currentStudent.attendance || 'N/A'}%
            </div>
            <p className="text-gray-500 mt-2">Overall Attendance</p>
          </div>
        </Card>
        <Card title="Upcoming Assignments" className="md:col-span-2">
          {upcomingAssignments.length > 0 ? (
            <ul className="space-y-3">
              {upcomingAssignments.map(assignment => (
                <li key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-academic-blue-dark">{assignment.title}</h4>
                    <span className="text-xs text-red-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{assignment.subject}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate('/student/assignments')} // Navigate to assignments page
                  >
                    View Details
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming assignments. Great job!</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnnouncementsList announcements={recentAnnouncements} title="School Announcements" />
        </div>
        
        <Card title="Quick Links">
          <div className="space-y-2">
            <Button variant="primary" className="w-full" onClick={() => navigate('/student/schedule')}>View My Schedule</Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate('/student/grades')}>Check My Grades</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/student/assignments')}>Submit Homework</Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/student/messages')}>Contact Teachers</Button>
          </div>
        </Card>
      </div>
      
      <Card title="Today's Classes"> {/* This is simplified, actual data comes from StudentTimetablePage */}
        <ul className="space-y-2">
          <li className="flex justify-between p-2 bg-blue-50 rounded"><span>09:00 AM - Math</span> <span className="text-gray-500">Room 101</span></li>
          <li className="flex justify-between p-2 bg-green-50 rounded"><span>10:00 AM - Science</span> <span className="text-gray-500">Lab A</span></li>
          <li className="flex justify-between p-2 bg-yellow-50 rounded"><span>11:30 AM - History</span> <span className="text-gray-500">Room 203</span></li>
        </ul>
      </Card>

    </div>
  );
};

export default StudentOverviewContent;
