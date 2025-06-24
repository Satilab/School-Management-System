import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { mockStudents, mockFees, mockAnnouncements, getChildrenOfParent, getFeesForStudent } from '../../services/mockData';
import { Student, Fee, Announcement as AnnouncementType, UserRole } from '../../types';
import Button from '../../components/ui/Button';
import AnnouncementsList from '../shared/AnnouncementsList';
import { Link } from 'react-router-dom';
import MinimalFeaturePage from '../shared/MinimalFeaturePage';

interface ParentOverviewContentProps {
  parentId: string;
}

const ParentOverviewContent: React.FC<ParentOverviewContentProps> = ({ parentId }) => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);
  const [focusedChild, setFocusedChild] = useState<Student | null>(null); // For displaying one child's details in overview
  const [childFees, setChildFees] = useState<Fee[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    setLoading(true);
    const parentChildren = getChildrenOfParent(parentId);
    setChildren(parentChildren);

    if (parentChildren.length > 0) {
      const firstChild = parentChildren[0]; // Focus on the first child for the overview
      setFocusedChild(firstChild);
      setChildFees(getFeesForStudent(firstChild.id));
    }
    
    setRecentAnnouncements(mockAnnouncements.filter(an => an.roleAudience.includes(UserRole.PARENT) || an.roleAudience.includes(UserRole.ADMIN)).slice(0, 3));
    setLoading(false);
  }, [parentId]);

  if (loading) return <Spinner />;
  if (!focusedChild && children.length > 0) { // If children exist but focusedChild not set yet (edge case)
      setFocusedChild(children[0]); // set it
      return <Spinner/>; // re-render
  }
  if (children.length === 0) return <Card><p className="text-center text-gray-500 py-8">No children linked to this profile. Please contact admin.</p></Card>;


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
      {focusedChild && (
          <p className="text-gray-600">
            Overview for <span className="font-semibold text-academic-blue">{focusedChild.name}</span> (Class {focusedChild.class}{focusedChild.section})
            {children.length > 1 && <Link to="/parent/children" className="ml-2 text-sm text-academic-blue hover:underline">(View all children)</Link>}
          </p>
      )}

    {focusedChild && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Attendance Summary">
            <div className="flex items-center justify-center p-4">
                <Icons.Attendance className={`w-12 h-12 mr-4 ${focusedChild.attendance && focusedChild.attendance >= 90 ? 'text-accent-green' : 'text-accent-yellow'}`}/>
                <div>
                <p className={`text-3xl font-bold ${focusedChild.attendance && focusedChild.attendance >= 90 ? 'text-accent-green' : 'text-accent-yellow'}`}>
                    {focusedChild.attendance || 'N/A'}%
                </p>
                <p className="text-sm text-gray-500">Overall This Term</p>
                </div>
            </div>
            <Link to={`/parent/attendance?childId=${focusedChild.id}`} className="block w-full">
                <Button variant="outline" size="sm" className="w-full mt-2">View Detailed Attendance</Button>
            </Link>
            </Card>

            <Card title="Recent Grades">
            {focusedChild.grades ? (
                <ul className="space-y-2">
                {Object.entries(focusedChild.grades).slice(0,3).map(([subject, grade]) => ( // Show first 3
                    <li key={subject} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium text-gray-700">{subject}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${grade.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{grade}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-500">No grades available yet.</p>
            )}
            <Link to={`/parent/grades?childId=${focusedChild.id}`} className="block w-full">
                <Button variant="outline" size="sm" className="w-full mt-2">View Full Report Card</Button>
            </Link>
            </Card>
            
            <Card title="Fee Status">
            {childFees.length > 0 ? childFees.slice(0,1).map(fee => ( // Show first due fee
                <div key={fee.id} className="mb-3 p-3 border rounded-md">
                <div className="flex justify-between items-center">
                    <p className="font-medium">Term Fee</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                    fee.status === 'Due' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {fee.status}
                    </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">₹{fee.amount}</p>
                <p className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                 <Link to={`/parent/fees?childId=${focusedChild.id}`} className="block w-full">
                    {fee.status !== 'Paid' && <Button variant="primary" size="sm" className="w-full mt-2">Pay Now / View All</Button>}
                    {fee.status === 'Paid' && <Button variant="outline" size="sm" className="w-full mt-2">View All Fees</Button>}
                </Link>
                </div>
            )) : <p className="text-gray-500">No outstanding fees.</p>}
            </Card>
        </div>
      </>
    )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <AnnouncementsList announcements={recentAnnouncements} title="School Communications" />
        </div>
        <Card title="Quick Actions">
          <div className="space-y-2">
            <Button variant="primary" className="w-full">Message Teacher (Coming Soon)</Button>
            <Button variant="secondary" className="w-full">Submit Feedback/Query (Coming Soon)</Button>
            <MinimalFeaturePage title="View School Calendar" description="The full calendar view is under development." icon={<Icons.Events className="w-5 h-5 inline mr-2"/>}/>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentOverviewContent;