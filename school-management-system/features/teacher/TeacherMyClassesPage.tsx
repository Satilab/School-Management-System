import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { ClassDetails, Student, Teacher } from '../../types';
import { mockClasses, mockStudents, getTeacherById, getStudentsByClass, getClassDetailsById } from '../../services/mockData';
import { Icons } from '../../constants';
import { Link } from 'react-router-dom';

interface TeacherMyClassesPageProps {
  teacherId: string;
}

const TeacherMyClassesPage: React.FC<TeacherMyClassesPageProps> = ({ teacherId }) => {
  const [loading, setLoading] = useState(true);
  const [assignedClassesDetails, setAssignedClassesDetails] = useState<ClassDetails[]>([]);
  const [selectedClassStudents, setSelectedClassStudents] = useState<Student[]>([]);
  const [viewingClass, setViewingClass] = useState<ClassDetails | null>(null);

  useEffect(() => {
    setLoading(true);
    const teacher = getTeacherById(teacherId);
    if (teacher) {
      const details = teacher.assignedClasses
        .map(classId => getClassDetailsById(classId))
        .filter(Boolean) as ClassDetails[];
      setAssignedClassesDetails(details);
    }
    setLoading(false);
  }, [teacherId]);

  const handleViewStudents = (classDetail: ClassDetails) => {
    setViewingClass(classDetail);
    setSelectedClassStudents(getStudentsByClass(classDetail.id));
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Assigned Classes</h1>

      {assignedClassesDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClassesDetails.map(cls => (
            <Card key={cls.id} title={`${cls.name} - Section ${cls.section}`} className="hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600">Class ID: {cls.id}</p>
              <p className="text-sm text-gray-600">Student Count: {getStudentsByClass(cls.id).length}</p>
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  onClick={() => handleViewStudents(cls)}
                  className="w-full text-sm bg-academic-blue text-white hover:bg-academic-blue-dark px-3 py-1.5 rounded-md transition-colors"
                >
                  View Students
                </button>
                <Link 
                  to={`/teacher/attendance?classId=${cls.id}`} 
                  className="w-full text-center text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1.5 rounded-md transition-colors"
                >
                  Mark Attendance
                </Link>
                 <Link 
                  to={`/teacher/grades?classId=${cls.id}`} 
                  className="w-full text-center text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1.5 rounded-md transition-colors"
                >
                  Enter Grades
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><p className="text-center text-gray-500 py-8">You are not currently assigned to any classes.</p></Card>
      )}

      {viewingClass && (
        <Card title={`Students in ${viewingClass.name} - ${viewingClass.section}`} className="mt-8">
          <button 
            onClick={() => setViewingClass(null)} 
            className="mb-4 text-sm text-academic-blue hover:underline"
          >
            &larr; Back to all classes
          </button>
          {selectedClassStudents.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {selectedClassStudents.map(student => (
                <li key={student.id} className="py-3 flex items-center space-x-3">
                  <img src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`} alt={student.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">Roll No: {student.rollNumber} | ID: {student.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students found in this class.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default TeacherMyClassesPage;
