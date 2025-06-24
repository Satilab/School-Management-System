import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Student, DailyAttendance, AttendanceStatus } from '../../types';
import { getChildrenOfParent, getStudentAttendanceDetails, mockStudents } from '../../services/mockData';
import { Icons } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';

interface ParentChildAttendancePageProps {
  parentId: string;
}

const ParentChildAttendancePage: React.FC<ParentChildAttendancePageProps> = ({ parentId }) => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [selectedChildId, setSelectedChildId] = useState<string>(queryParams.get('childId') || '');
  const [attendanceDetails, setAttendanceDetails] = useState<DailyAttendance[]>([]);
  const [overallAttendance, setOverallAttendance] = useState<number | undefined>(undefined);

  const selectStyle = "w-full sm:w-auto p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                      "bg-white text-gray-900 border-gray-300 " + // Light mode
                      "dark:bg-gray-700 dark:text-white dark:border-gray-600 " + // Dark mode
                      "hc-bg-secondary hc-text-primary hc-border-primary"; // HC mode

  useEffect(() => {
    setLoading(true);
    const parentChildren = getChildrenOfParent(parentId);
    setChildren(parentChildren);
    if (parentChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(parentChildren[0].id); // Default to first child if none selected via URL
    }
    setLoading(false);
  }, [parentId, selectedChildId]); // Re-run if selectedChildId changes from outside

  useEffect(() => {
    if (selectedChildId) {
      setLoading(true);
      setAttendanceDetails(getStudentAttendanceDetails(selectedChildId));
      const child = mockStudents.find(s => s.id === selectedChildId);
      setOverallAttendance(child?.attendance);
      // Update URL query param if not already set or changed
      if (queryParams.get('childId') !== selectedChildId) {
        navigate(`${location.pathname}?childId=${selectedChildId}`, { replace: true });
      }
      setLoading(false);
    } else {
        setAttendanceDetails([]);
        setOverallAttendance(undefined);
    }
  }, [selectedChildId, location.pathname, navigate]);


  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 hc-bg-green-700 hc-text-white';
      case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 hc-bg-red-600 hc-text-white';
      case AttendanceStatus.LATE: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100 hc-bg-yellow-500 hc-text-black';
      case AttendanceStatus.HOLIDAY: return 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100 hc-bg-blue-600 hc-text-white';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hc-bg-gray-700 hc-text-white'; // NOT_MARKED
    }
  };
  
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Child's Attendance Record</h1>
      
      {children.length > 0 && (
        <div className="mb-4">
            <label htmlFor="childSelectAttendance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Child:</label>
            <select
                id="childSelectAttendance"
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className={selectStyle}
            >
                {children.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
                ))}
            </select>
        </div>
      )}

      {loading && <Spinner />}

      {!loading && selectedChild && (
        <>
          <Card title={`Attendance for ${selectedChild.name} (Class ${selectedChild.class}${selectedChild.section})`} className="hc-bg-secondary">
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center hc-bg-secondary">
              <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">Overall Attendance This Term</p>
              <p className={`text-4xl font-bold mt-1 ${overallAttendance && overallAttendance >= 90 ? 'text-accent-green dark:text-green-400 hc-accent-secondary-text' : 'text-accent-yellow dark:text-yellow-400 hc-accent-primary-text'}`}>
                {overallAttendance !== undefined ? `${overallAttendance}%` : 'N/A'}
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 hc-text-primary mb-3">Daily Log (Recent First)</h3>
            {attendanceDetails.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                  {attendanceDetails.map(record => (
                    <li key={record.id} className={`p-3 rounded-md flex justify-between items-center ${getStatusColor(record.status)}`}>
                      <div>
                        <p className="font-medium">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {record.remarks && <p className="text-xs italic mt-1">Remarks: {record.remarks}</p>}
                      </div>
                      <span className="font-semibold">{record.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">No daily attendance records found for this child.</p>
            )}
          </Card>
        </>
      )}
      {!loading && children.length === 0 && (
         <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">No children linked to view attendance.</p></Card>
      )}
       {!loading && children.length > 0 && !selectedChildId && (
         <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">Please select a child to view their attendance.</p></Card>
      )}
    </div>
  );
};

export default ParentChildAttendancePage;