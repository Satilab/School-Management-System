
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Assignment } from '../../types';
import { getAssignmentsForStudent } from '../../services/mockData';
import { Icons } from '../../constants';

interface StudentAssignmentsPageProps {
  studentClassId: string;
}

const StudentAssignmentsPage: React.FC<StudentAssignmentsPageProps> = ({ studentClassId }) => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssignments(getAssignmentsForStudent(studentClassId));
      setLoading(false);
    }, 300);
  }, [studentClassId]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(assignment => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-academic-blue">{assignment.title}</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${new Date(assignment.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Subject:</span> {assignment.subject}</p>
              <p className="text-sm text-gray-700 mb-3"><span className="font-medium">Teacher:</span> {assignment.teacherName}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{assignment.description}</p>
              
              <div className="flex items-center justify-between">
                <Button variant="primary" size="sm" leftIcon={<Icons.Assignments className="w-4 h-4"/>}>
                  View & Submit
                </Button>
                {assignment.fileUrl && (
                  <a 
                    href={assignment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-academic-blue hover:underline"
                  >
                    Download Attachment
                  </a>
                )}
              </div>
               {/* Placeholder for submission status */}
               <div className="mt-3 pt-3 border-t border-gray-200">
                 <p className="text-xs text-gray-500">Status: <span className="font-semibold text-orange-500">Pending Submission</span></p>
               </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Icons.Assignments className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No assignments due at the moment. Great job!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
