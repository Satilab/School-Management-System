import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Student, ClassDetails, Assignment, ReportCard, SubjectGrade } from '../../types';
import { getStudentsByClass, getAssignmentsByTeacher, mockClasses, mockReportCards, getClassDetailsById, mockAssignments as allMockAssignments } from '../../services/mockData';
import { useLocation } from 'react-router-dom';

interface TeacherGradesEntryPageProps {
  teacherId: string;
  assignedClasses: string[]; // IDs of classes assigned to teacher
}

const TeacherGradesEntryPage: React.FC<TeacherGradesEntryPageProps> = ({ teacherId, assignedClasses }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedClassId = queryParams.get('classId');

  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>(preselectedClassId || (assignedClasses.length > 0 ? assignedClasses[0] : ''));
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
  const [classAssignments, setClassAssignments] = useState<Assignment[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [marks, setMarks] = useState<string>(''); // Marks obtained
  const [remarks, setRemarks] = useState<string>('');

  const availableClasses = assignedClasses.map(id => getClassDetailsById(id)).filter(Boolean) as ClassDetails[];
  
  const formElementStyle = "w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Explicit light mode
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";

  useEffect(() => {
    if (selectedClassId) {
      setLoading(true);
      setStudentsInClass(getStudentsByClass(selectedClassId));
      const assignmentsForClassByTeacher = allMockAssignments.filter(
        asgn => asgn.teacherId === teacherId && asgn.classIds.includes(selectedClassId)
      );
      setClassAssignments(assignmentsForClassByTeacher);
      setSelectedStudentId('');
      setSelectedAssignmentId('');
      setGrade('');
      setMarks('');
      setRemarks('');
      setLoading(false);
    } else {
        setStudentsInClass([]);
        setClassAssignments([]);
    }
  }, [selectedClassId, teacherId]);

  const handleSaveGrade = () => {
    if (!selectedStudentId || !selectedAssignmentId || (!grade && !marks)) {
      alert("Please select student, assignment, and enter grade/marks.");
      return;
    }
    setLoading(true);
    
    const assignment = classAssignments.find(a => a.id === selectedAssignmentId);
    if (assignment) {
        if (!assignment.submissions) {
            assignment.submissions = [];
        }
        let submission = assignment.submissions.find(s => s.studentId === selectedStudentId);
        if (submission) {
            submission.grade = grade || submission.grade;
            submission.comments = remarks || submission.comments;
            if (marks) submission.marksObtained = parseFloat(marks);
        } else {
            const student = studentsInClass.find(s => s.id === selectedStudentId);
            assignment.submissions.push({
                studentId: selectedStudentId,
                studentName: student?.name || 'Unknown Student',
                submissionDate: new Date().toISOString().split('T')[0],
                grade: grade,
                marksObtained: marks ? parseFloat(marks) : undefined,
                maxMarks: assignment.maxMarks,
                comments: remarks,
            });
        }
    }

    console.log(`Mock Save: Student ${selectedStudentId}, Assignment ${selectedAssignmentId}, Grade: ${grade}, Marks: ${marks}, Remarks: ${remarks}`);
    
    setLoading(false);
    alert("Grade/Marks saved successfully (mocked)!");
    setGrade('');
    setMarks('');
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Enter Grades/Marks</h1>

      <Card className="hc-bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-4 border-b dark:border-gray-700 hc-border-primary">
          <div>
            <label htmlFor="classSelectGrade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Class</label>
            <select
              id="classSelectGrade"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className={formElementStyle}
              disabled={availableClasses.length === 0}
            >
              <option value="">-- Select Class --</option>
              {availableClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} - {cls.section}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="assignmentSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Assignment/Exam</label>
            <select
              id="assignmentSelect"
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className={formElementStyle}
              disabled={!selectedClassId || classAssignments.length === 0}
            >
              <option value="">-- Select Assignment/Exam --</option>
              {classAssignments.map(asgn => (
                <option key={asgn.id} value={asgn.id}>{asgn.title} ({asgn.subject})</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <Spinner />}

        {!loading && selectedClassId && selectedAssignmentId && studentsInClass.length > 0 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="studentSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Student</label>
              <select
                id="studentSelect"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className={formElementStyle}
              >
                <option value="">-- Select Student --</option>
                {studentsInClass.map(student => (
                  <option key={student.id} value={student.id}>{student.name} (Roll: {student.rollNumber})</option>
                ))}
              </select>
            </div>

            {selectedStudentId && (
              <Card title={`Enter Grade for ${studentsInClass.find(s=>s.id === selectedStudentId)?.name}`} className="bg-gray-50 dark:bg-gray-700/50 hc-bg-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="marks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Marks Obtained</label>
                        <input type="number" id="marks" value={marks} onChange={e => setMarks(e.target.value)} className={`${formElementStyle} mt-1`} placeholder="e.g., 85"/>
                    </div>
                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Grade (Optional)</label>
                        <input type="text" id="grade" value={grade} onChange={e => setGrade(e.target.value)} className={`${formElementStyle} mt-1`} placeholder="e.g., A+"/>
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Remarks (Optional)</label>
                    <textarea id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} className={`${formElementStyle} mt-1`} placeholder="e.g., Excellent work!"/>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSaveGrade} isLoading={loading} variant="primary">Save Grade/Marks</Button>
                </div>
              </Card>
            )}
          </div>
        )}
        {!loading && selectedClassId && studentsInClass.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">No students in selected class.</p>
        )}
        {!loading && selectedClassId && classAssignments.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">No assignments/exams found for this class created by you.</p>
        )}
        {!loading && !selectedClassId && availableClasses.length > 0 && (
             <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">Please select a class and an assignment/exam.</p>
        )}
         {!loading && availableClasses.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-4">You are not assigned to any classes for grade entry.</p>
        )}
      </Card>
    </div>
  );
};

export default TeacherGradesEntryPage;