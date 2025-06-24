import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Student } from '../../types';
import { getChildrenOfParent } from '../../services/mockData';
import { Icons } from '../../constants';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

interface ParentChildrenPageProps {
  parentId: string;
}

const ParentChildrenPage: React.FC<ParentChildrenPageProps> = ({ parentId }) => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);

  useEffect(() => {
    setLoading(true);
    setChildren(getChildrenOfParent(parentId));
    setLoading(false);
  }, [parentId]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Children</h1>

      {children.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map(child => (
            <Card key={child.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4 p-4">
                <img 
                  src={child.photoUrl || `https://ui-avatars.com/api/?name=${child.name.replace(' ', '+')}&background=random`} 
                  alt={child.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-academic-blue"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-academic-blue-dark">{child.name}</h2>
                  <p className="text-sm text-gray-600">Class: {child.class}{child.section}</p>
                  <p className="text-sm text-gray-600">Roll Number: {child.rollNumber}</p>
                  <p className="text-sm text-gray-600">Student ID: {child.id}</p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 mt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <Link to={`/parent/attendance?childId=${child.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View Attendance</Button>
                    </Link>
                    <Link to={`/parent/grades?childId=${child.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View Grades</Button>
                    </Link>
                    <Link to={`/parent/fees?childId=${child.id}`}>
                         <Button variant="outline" size="sm" className="w-full">Fee Details</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full" onClick={()=>alert('Contact teacher functionality coming soon!')}>Contact Teacher</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Icons.Students className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No children are currently linked to your profile.</p>
            <p className="text-sm text-gray-400 mt-2">Please contact the school administration if this is an error.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ParentChildrenPage;
