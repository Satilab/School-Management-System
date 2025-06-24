import React from 'react';
import Modal from '../../components/ui/Modal';
import { Assignment, AssignmentSubmission, Student } from '../../types';
import { Icons } from '../../constants';
import Button from '../../components/ui/Button';

interface AssignmentPerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  assignments: Array<Assignment & { submissionDetails?: AssignmentSubmission, isSubmitted?: boolean }>;
}

const AssignmentPerformanceModal: React.FC<AssignmentPerformanceModalProps> = ({ isOpen, onClose, student, assignments }) => {
  if (!isOpen || !student) return null;

  const submittedAssignments = assignments.filter(a => a.submissionDetails || a.isSubmitted);
  const pendingAssignments = assignments.filter(a => !(a.submissionDetails || a.isSubmitted) && new Date(a.dueDate) >= new Date());
  const pastDueUnsubmitted = assignments.filter(a => !(a.submissionDetails || a.isSubmitted) && new Date(a.dueDate) < new Date());


  const renderAssignmentItem = (assignment: Assignment & { submissionDetails?: AssignmentSubmission }, type: 'submitted' | 'pending' | 'pastdue') => (
    <li key={assignment.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 space-y-1">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-academic-blue-dark">{assignment.title}</h4>
        <span className="text-xs text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-600">Subject: {assignment.subject}</p>
      {type === 'submitted' && assignment.submissionDetails && (
        <>
          <p className="text-xs text-green-600">Submitted: {new Date(assignment.submissionDetails.submissionDate).toLocaleDateString()}</p>
          {assignment.submissionDetails.grade && <p className="text-xs">Grade: <span className="font-bold">{assignment.submissionDetails.grade}</span></p>}
          {assignment.submissionDetails.marksObtained !== undefined && <p className="text-xs">Marks: <span className="font-bold">{assignment.submissionDetails.marksObtained} / {assignment.submissionDetails.maxMarks || assignment.maxMarks || 'N/A'}</span></p>}
          {assignment.submissionDetails.comments && <p className="text-xs italic text-gray-500">Feedback: {assignment.submissionDetails.comments}</p>}
        </>
      )}
      {type === 'pending' && <span className="text-xs font-semibold text-yellow-600">Status: Pending Submission</span>}
      {type === 'pastdue' && <span className="text-xs font-semibold text-red-600">Status: Past Due (Not Submitted)</span>}
       <Button size="sm" variant="outline" className="mt-1 !text-xs" onClick={() => alert(`Viewing details for ${assignment.title}`)}>View/Submit Assignment</Button>
    </li>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assignment Performance - ${student.name}`} size="xl">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <Icons.CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Submitted Assignments ({submittedAssignments.length})
          </h3>
          {submittedAssignments.length > 0 ? (
            <ul className="space-y-2">{submittedAssignments.map(a => renderAssignmentItem(a, 'submitted'))}</ul>
          ) : (
            <p className="text-sm text-gray-500 pl-7">No assignments submitted yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
            <Icons.Assignments className="w-5 h-5 mr-2 text-yellow-500" /> Pending Assignments ({pendingAssignments.length})
          </h3>
          {pendingAssignments.length > 0 ? (
            <ul className="space-y-2">{pendingAssignments.map(a => renderAssignmentItem(a, 'pending'))}</ul>
          ) : (
            <p className="text-sm text-gray-500 pl-7">No assignments currently pending.</p>
          )}
        </div>
        
        {pastDueUnsubmitted.length > 0 && (
            <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                <Icons.Close className="w-5 h-5 mr-2 text-red-500" /> Past Due & Not Submitted ({pastDueUnsubmitted.length})
            </h3>
            <ul className="space-y-2">{pastDueUnsubmitted.map(a => renderAssignmentItem(a, 'pastdue'))}</ul>
            </div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="primary">Close</Button>
      </div>
    </Modal>
  );
};

export default AssignmentPerformanceModal;
