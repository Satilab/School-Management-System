import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Student, ClassDetails, AttendanceStatus, DailyAttendance } from '../../types';
import { getStudentsByClass, mockClasses, mockDailyAttendance as initialMockAttendance, getClassDetailsById } from '../../services/mockData';
import { useLocation } from 'react-router-dom';

interface TeacherAttendancePageProps {
  teacherId: string;
  assignedClasses: string[]; // IDs of classes assigned to teacher
}

const TeacherAttendancePage: React.FC<TeacherAttendancePageProps> = ({ teacherId, assignedClasses }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedClassId = queryParams.get('classId');

  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(preselectedClassId || (assignedClasses.length > 0 ? assignedClasses[0] : ''));
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, AttendanceStatus>>(new Map()); // studentId -> status

  const availableClasses = assignedClasses.map(id => getClassDetailsById(id)).filter(Boolean) as ClassDetails[];
  
  const formElementStyle = "w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Explicit light mode
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";


  useEffect(() => {
    if (selectedClassId) {
      setLoading(true);
      const classStudents = getStudentsByClass(selectedClassId);
      setStudents(classStudents);
      
      const newRecords = new Map<string, AttendanceStatus>();
      classStudents.forEach(student => {
        const existingRecord = initialMockAttendance.find(
          att => att.studentId === student.id && att.date === attendanceDate && att.classId === selectedClassId
        );
        newRecords.set(student.id, existingRecord ? existingRecord.status : AttendanceStatus.NOT_MARKED);
      });
      setAttendanceRecords(newRecords);
      setLoading(false);
    } else {
      setStudents([]);
      setAttendanceRecords(new Map());
    }
  }, [selectedClassId, attendanceDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords(prev => new Map(prev).set(studentId, status));
  };

  const handleSaveAttendance = () => {
    if (!selectedClassId) {
        alert("Please select a class.");
        return;
    }
    setLoading(true);
    console.log("Saving attendance for class:", selectedClassId, "on date:", attendanceDate);
    attendanceRecords.forEach((status, studentId) => {
        if (status !== AttendanceStatus.NOT_MARKED) { 
            const existingRecordIndex = initialMockAttendance.findIndex(
                att => att.studentId === studentId && att.date === attendanceDate && att.classId === selectedClassId
            );
            const newRecord: DailyAttendance = {
                id: `ATT-${studentId}-${attendanceDate.replace(/-/g, '')}`, 
                studentId,
                date: attendanceDate,
                status,
                classId: selectedClassId,
            };
            if(existingRecordIndex > -1) {
                initialMockAttendance[existingRecordIndex] = newRecord;
            } else {
                initialMockAttendance.push(newRecord);
            }
            console.log(`Saved: Student ${studentId}, Status: ${status}`);
        }
    });
    setLoading(false);
    alert("Attendance saved successfully (mocked)!");
  };

  const markAll = (status: AttendanceStatus) => {
    const newRecords = new Map<string, AttendanceStatus>();
    students.forEach(student => newRecords.set(student.id, status));
    setAttendanceRecords(newRecords);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Mark Attendance</h1>

      <Card className="hc-bg-secondary">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b dark:border-gray-700 hc-border-primary">
          <div className="flex-1">
            <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Class</label>
            <select
              id="classSelect"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className={formElementStyle}
              disabled={availableClasses.length === 0}
            >
              <option value="">-- Select a Class --</option>
              {availableClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="attendanceDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Date</label>
            <input
              type="date"
              id="attendanceDate"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className={formElementStyle}
            />
          </div>
        </div>

        {loading && <Spinner />}
        
        {!loading && selectedClassId && students.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => markAll(AttendanceStatus.PRESENT)}>Mark All Present</Button>
                <Button size="sm" variant="outline" onClick={() => markAll(AttendanceStatus.ABSENT)}>Mark All Absent</Button>
            </div>
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
              {students.map(student => (
                <li key={student.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center hc-bg-secondary">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <img src={student.photoUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`} alt={student.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100 hc-text-primary">{student.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">Roll: {student.rollNumber}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    {[AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE].map(status => (
                      <Button
                        key={status}
                        size="sm"
                        variant={attendanceRecords.get(student.id) === status ? 'primary' : 'ghost'}
                        onClick={() => handleStatusChange(student.id, status)}
                        className={`min-w-[80px] sm:min-w-[90px] ${
                            attendanceRecords.get(student.id) === status 
                            ? (status === AttendanceStatus.PRESENT ? 'bg-accent-green hover:bg-accent-green-dark dark:bg-green-500 dark:hover:bg-green-600 hc-bg-green-600 hc-text-white' 
                                : status === AttendanceStatus.ABSENT ? 'bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 hc-bg-red-600 hc-text-white'
                                : 'bg-accent-yellow hover:bg-accent-yellow-dark dark:bg-yellow-500 dark:hover:bg-yellow-600 hc-bg-yellow-500 hc-text-black')
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hc-text-secondary hc-hover:bg-gray-700'
                        }`}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
             <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveAttendance} isLoading={loading} variant="primary">
                 Save Attendance
                </Button>
            </div>
          </>
        )}
        {!loading && selectedClassId && students.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">No students found in the selected class.</p>
        )}
        {!loading && !selectedClassId && availableClasses.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">Please select a class to mark attendance.</p>
        )}
         {!loading && availableClasses.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">You are not assigned to any classes for attendance marking.</p>
        )}
      </Card>
    </div>
  );
};

export default TeacherAttendancePage;