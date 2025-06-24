
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { ReportCard, SubjectGrade, Student } from '../../types';
import { getReportCardsForStudent, mockStudents } from '../../services/mockData';
import { Icons } from '../../constants';

interface StudentGradesPageProps {
  studentId: string;
}

const StudentGradesPage: React.FC<StudentGradesPageProps> = ({ studentId }) => {
  const [loading, setLoading] = useState(true);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [selectedReportCard, setSelectedReportCard] = useState<ReportCard | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const selectStyle = "block w-full sm:w-auto pl-3 pr-10 py-2 text-base rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " +
                      "bg-white text-gray-900 border-gray-300 " + // Light mode
                      "dark:bg-gray-700 dark:text-white dark:border-gray-600 " + // Dark mode
                      "hc-bg-secondary hc-text-primary hc-border-primary"; // HC mode

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const studentData = mockStudents.find(s => s.id === studentId);
      setStudent(studentData || null);
      const fetchedReportCards = getReportCardsForStudent(studentId);
      setReportCards(fetchedReportCards);
      if (fetchedReportCards.length > 0) {
        setSelectedReportCard(fetchedReportCards[0]); // Select the most recent one by default
      }
      setLoading(false);
    }, 500);
  }, [studentId]);

  const handleReportCardSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cardId = e.target.value;
    const foundCard = reportCards.find(rc => rc.id === cardId);
    setSelectedReportCard(foundCard || null);
  };

  const getGradeColor = (grade: string) => {
    if (!grade) return 'text-gray-700 dark:text-gray-300 hc-text-secondary';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.includes('A')) return 'text-accent-green dark:text-green-400 hc-accent-secondary-text';
    if (upperGrade.includes('B')) return 'text-blue-500 dark:text-blue-400 hc-accent-secondary-text';
    if (upperGrade.includes('C')) return 'text-yellow-500 dark:text-yellow-400 hc-accent-primary-text';
    if (upperGrade.includes('D')) return 'text-orange-500 dark:text-orange-400 hc-accent-primary-text';
    return 'text-red-500 dark:text-red-400 hc-accent-primary-text';
  };

  if (loading) return <Spinner />;
  if (!student) return <Card className="hc-bg-secondary"><p className="text-center text-red-500 dark:text-red-400 hc-text-accent-primary-text">Student data not found.</p></Card>;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">My Grades & Report Card</h1>
        {reportCards.length > 1 && (
          <div className="flex items-center space-x-2">
            <label htmlFor="reportCardSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Select Term:</label>
            <select
              id="reportCardSelect"
              value={selectedReportCard?.id || ''}
              onChange={handleReportCardSelect}
              className={selectStyle}
            >
              {reportCards.map(rc => (
                <option key={rc.id} value={rc.id}>{rc.termName}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedReportCard && reportCards.length > 0 && (
         <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">Please select a term to view the report card.</p></Card>
      )}
      {!selectedReportCard && reportCards.length === 0 && (
         <Card className="hc-bg-secondary">
            <div className="text-center py-12">
                <Icons.Grades className="w-16 h-16 text-gray-300 dark:text-gray-600 hc-text-secondary mx-auto mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400 hc-text-secondary">No report cards available at the moment.</p>
            </div>
         </Card>
      )}

      {selectedReportCard && (
        <Card className="shadow-xl hc-bg-secondary">
          <div className="p-4 sm:p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 hc-border-primary pb-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-academic-blue-dark dark:text-academic-blue hc-text-primary">{selectedReportCard.termName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">Student: {student.name} | Class: {student.class}{student.section} (Roll: {student.rollNumber})</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mt-2 sm:mt-0">Issued: {new Date(selectedReportCard.issueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 hc-text-primary mb-4">Subject-wise Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hc-divide-border-primary">
                <thead className="bg-gray-50 dark:bg-gray-700 hc-bg-primary">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Subject</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Marks Obtained</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Max Marks</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Grade</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 hc-divide-border-primary hc-bg-secondary">
                  {selectedReportCard.subjects.map((subject, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800 hc-bg-secondary' : 'bg-gray-50 dark:bg-gray-700/50 hc-bg-secondary'}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 hc-text-primary">{subject.subjectName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hc-text-secondary">{subject.marksObtained}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hc-text-secondary">{subject.maxMarks}</td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${getGradeColor(subject.grade)}`}>{subject.grade}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">{subject.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 hc-border-primary">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 hc-text-primary mb-3">Overall Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedReportCard.overallPercentage !== undefined && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hc-bg-secondary">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 hc-text-accent-secondary-text">Overall Percentage</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 hc-accent-secondary-text">{selectedReportCard.overallPercentage.toFixed(2)}%</p>
                  </div>
                )}
                {selectedReportCard.overallGrade && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hc-bg-secondary">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 hc-text-accent-secondary-text">Overall Grade</p>
                    <p className={`text-2xl font-bold ${getGradeColor(selectedReportCard.overallGrade)}`}>{selectedReportCard.overallGrade}</p>
                  </div>
                )}
              </div>
               {selectedReportCard.teacherComments && (
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 hc-text-secondary">Teacher's Comments:</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 hc-text-secondary hc-bg-secondary">{selectedReportCard.teacherComments}</p>
                </div>
                )}
            </div>

            <div className="mt-8 text-center">
              <Button 
                variant="primary" 
                leftIcon={<Icons.Reports className="w-5 h-5"/>}
                onClick={() => alert('Download functionality is not implemented in this mock version.')}
              >
                Download Report Card (PDF)
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentGradesPage;