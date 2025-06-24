import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { DailyAttendance, AttendanceStatus, Student } from '../../types';
import { Icons } from '../../constants';
import Button from '../../components/ui/Button';

interface StudentAttendanceCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  attendanceRecords: DailyAttendance[];
}

const StudentAttendanceCalendarModal: React.FC<StudentAttendanceCalendarModalProps> = ({ isOpen, onClose, student, attendanceRecords }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen || !student) return null;

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const numDays = daysInMonth(year, month);
  const startingDay = firstDayOfMonth(year, month); // Adjust if your week starts on Monday

  const getStatusForDay = (day: number): AttendanceStatus | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = attendanceRecords.find(r => r.date === dateStr);
    return record?.status;
  };

  const getStatusColorClass = (status?: AttendanceStatus): string => {
    if (!status) return 'bg-white hover:bg-gray-100';
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-green-400 text-white hover:bg-green-500';
      case AttendanceStatus.ABSENT: return 'bg-red-400 text-white hover:bg-red-500';
      case AttendanceStatus.LATE: return 'bg-yellow-400 text-black hover:bg-yellow-500'; // text-black for better contrast
      case AttendanceStatus.HOLIDAY: return 'bg-blue-300 text-white hover:bg-blue-400';
      default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300'; // NOT_MARKED
    }
  };
  
  const getRemarksForDay = (day: number): string | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = attendanceRecords.find(r => r.date === dateStr);
    return record?.remarks;
  };

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) { // Empty cells for days before month starts
    calendarDays.push(<div key={`empty-${i}`} className="border p-1 sm:p-2 h-12 sm:h-16"></div>);
  }
  for (let day = 1; day <= numDays; day++) {
    const status = getStatusForDay(day);
    const remarks = getRemarksForDay(day);
    calendarDays.push(
      <div 
        key={day} 
        className={`border p-1 sm:p-2 h-12 sm:h-16 text-xs sm:text-sm flex flex-col justify-between relative group ${getStatusColorClass(status)}`}
        title={remarks ? `${status || 'Not Marked'} - ${remarks}`: status || 'Not Marked'}
      >
        <span>{day}</span>
        {status && <span className="font-semibold self-center text-[10px] sm:text-xs leading-tight">{status === AttendanceStatus.NOT_MARKED ? '' : status}</span>}
        {remarks && <Icons.Communication className="w-3 h-3 text-gray-600 absolute bottom-1 right-1 opacity-70 group-hover:opacity-100"/>}
      </div>
    );
  }

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Attendance Calendar - ${student.name}`} size="xl">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => changeMonth(-1)} size="sm" variant="outline">&lt; Prev</Button>
          <h3 className="text-lg font-semibold text-academic-blue">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <Button onClick={() => changeMonth(1)} size="sm" variant="outline">Next &gt;</Button>
        </div>
        
        <div className="grid grid-cols-7 gap-px border bg-gray-200 text-center font-medium text-xs sm:text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
            <div key={dayName} className="bg-gray-100 py-1 sm:py-2">{dayName}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px border-l border-r border-b bg-gray-200">
          {calendarDays}
        </div>

        <div className="flex flex-wrap gap-2 text-xs mt-4">
            <span className="flex items-center"><span className="w-3 h-3 bg-green-400 mr-1 inline-block"></span>Present</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-red-400 mr-1 inline-block"></span>Absent</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-yellow-400 mr-1 inline-block"></span>Late</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-blue-300 mr-1 inline-block"></span>Holiday</span>
            <span className="flex items-center"><span className="w-3 h-3 bg-gray-200 mr-1 inline-block"></span>Not Marked</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Note: Subject-wise attendance details are not shown in this calendar view.</p>

        <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="primary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentAttendanceCalendarModal;