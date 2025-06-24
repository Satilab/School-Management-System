
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { Assignment, ClassDetails } from '../../types';
import { getAssignmentsByTeacher, mockAssignments as allAssignments, mockClasses } from '../../services/mockData'; // Assuming current teacher's assignments

interface TeacherAssignmentsPageProps {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[]; // e.g., ["10A", "9B"]
}

const TeacherAssignmentsPage: React.FC<TeacherAssignmentsPageProps> = ({ teacherId, teacherName, assignedClasses }) => {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    classIds: [] as string[],
  });

  const formElementStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + 
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssignments(getAssignmentsByTeacher(teacherId));
      setLoading(false);
    }, 300);
  }, [teacherId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleClassIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassIds = Array.from(e.target.selectedOptions, option => option.value);
    setNewAssignment(prev => ({ ...prev, classIds: selectedClassIds }));
  };
  
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.description || !newAssignment.subject || !newAssignment.dueDate || newAssignment.classIds.length === 0) {
      alert("Please fill in all fields and select at least one class.");
      return;
    }
    const createdAssignment: Assignment = {
      id: `AS${Date.now()}`, // Simple unique ID
      teacherId: teacherId,
      teacherName: teacherName,
      ...newAssignment,
    };
    // In a real app, this would be an API call
    allAssignments.push(createdAssignment); // Add to the global mock data
    setAssignments(prev => [...prev, createdAssignment]);
    setIsModalOpen(false);
    setNewAssignment({ title: '', description: '', subject: '', dueDate: '', classIds: [] }); // Reset form
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">My Assignments</h1>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Icons.Assignments className="w-5 h-5"/>}>
          Create New Assignment
        </Button>
      </div>

      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <Card key={assignment.id} title={assignment.title} className="hover:shadow-lg transition-shadow hc-bg-secondary">
              <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary mb-1"><span className="font-semibold">Subject:</span> {assignment.subject}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary mb-1 line-clamp-2"><span className="font-semibold">Description:</span> {assignment.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mb-1"><span className="font-semibold">Due Date:</span> {new Date(assignment.dueDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mb-3">
                <span className="font-semibold">Assigned to Classes:</span> {assignment.classIds.join(', ')}
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">View Submissions</Button>
                <Button size="sm" variant="ghost">Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="hc-bg-secondary">
          <p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">You haven't created any assignments yet.</p>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleSubmitAssignment} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Title</label>
            <input type="text" name="title" id="title" value={newAssignment.title} onChange={handleInputChange} required className={formElementStyle} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Description</label>
            <textarea name="description" id="description" value={newAssignment.description} onChange={handleInputChange} rows={3} required className={formElementStyle} />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Subject</label>
            <input type="text" name="subject" id="subject" value={newAssignment.subject} onChange={handleInputChange} required className={formElementStyle} />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Due Date</label>
            <input type="date" name="dueDate" id="dueDate" value={newAssignment.dueDate} onChange={handleInputChange} required className={formElementStyle} />
          </div>
          <div>
            <label htmlFor="classIds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Assign to Classes</label>
            <select
              multiple
              name="classIds"
              id="classIds"
              value={newAssignment.classIds}
              onChange={handleClassIdChange}
              required
              className={`${formElementStyle} h-32`}
            >
              {assignedClasses.map(classId => {
                  const classDetail = mockClasses.find(c => c.id === classId);
                  return (
                    <option key={classId} value={classId}>
                        {classDetail ? `${classDetail.name} ${classDetail.section}` : classId}
                    </option>
                  );
              })}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary mt-1">Hold Ctrl (or Cmd on Mac) to select multiple classes.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Assignment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherAssignmentsPage;