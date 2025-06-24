import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Student } from '../../types';
import { getChildrenOfParent } from '../../services/mockData';
import StudentGradesPage from '../student/StudentGradesPage'; // Re-use student's grade page
import { useLocation, useNavigate } from 'react-router-dom';

interface ParentChildGradesPageProps {
  parentId: string;
}

const ParentChildGradesPage: React.FC<ParentChildGradesPageProps> = ({ parentId }) => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [selectedChildId, setSelectedChildId] = useState<string>(queryParams.get('childId') || '');

  const selectStyle = "w-full sm:w-auto p-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue " +
                      "bg-white text-gray-900 border-gray-300 " + // Light mode
                      "dark:bg-gray-700 dark:text-white dark:border-gray-600 " + // Dark mode
                      "hc-bg-secondary hc-text-primary hc-border-primary"; // HC mode

  useEffect(() => {
    setLoading(true);
    const parentChildren = getChildrenOfParent(parentId);
    setChildren(parentChildren);
    if (parentChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(parentChildren[0].id);
    }
    setLoading(false);
  }, [parentId, selectedChildId]);
  
   useEffect(() => {
    if (selectedChildId && queryParams.get('childId') !== selectedChildId) {
      navigate(`${location.pathname}?childId=${selectedChildId}`, { replace: true });
    }
  }, [selectedChildId, location.pathname, navigate]);


  if (loading) return <Spinner />;
  
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Child's Grades & Report Cards</h1>

      {children.length > 0 && (
        <div className="mb-6">
            <label htmlFor="childSelectGrades" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Child:</label>
            <select
                id="childSelectGrades"
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

      {selectedChildId && selectedChild ? (
        // Pass a key to StudentGradesPage to force re-mount and re-fetch when childId changes
        <StudentGradesPage key={selectedChildId} studentId={selectedChildId} />
      ) : children.length > 0 ? (
        <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">Please select a child to view their grades.</p></Card>
      ) : (
        <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">No children linked to view grades.</p></Card>
      )}
    </div>
  );
};

export default ParentChildGradesPage;