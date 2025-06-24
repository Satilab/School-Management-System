import React, { useState, useEffect } from 'react';
import StatCard from '../../components/ui/StatCard';
import { Icons } from '../../constants';
import { mockStudents, mockTeachers, mockFees, mockAnnouncements } from '../../services/mockData';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import { ChartDataPoint, Fee, Announcement as AnnouncementType } from '../../types';
import Button from '../../components/ui/Button';
import AnnouncementsList from '../shared/AnnouncementsList';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const AdminOverviewContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [feeData, setFeeData] = useState<ChartDataPoint[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    setTimeout(() => {
      const paid = mockFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
      const due = mockFees.filter(f => f.status === 'Due').reduce((sum, f) => sum + f.amount, 0);
      const overdue = mockFees.filter(f => f.status === 'Overdue').reduce((sum, f) => sum + f.amount, 0);
      setFeeData([
        { name: 'Paid', value: paid, fill: '#10B981' }, 
        { name: 'Due', value: due, fill: '#F59E0B' },   
        { name: 'Overdue', value: overdue, fill: '#EF4444' }, 
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const formInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                         "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Light mode
                         "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " + // Dark mode
                         "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text"; // HC mode (hc-placeholder-text would need a CSS var like --hc-placeholder-text)

  const AddStudentForm: React.FC = () => (
    <form className="space-y-4">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Student Name</label>
        <input type="text" id="studentName" className={formInputStyle} placeholder="Enter student name"/>
      </div>
       <div>
        <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Class</label>
        <input type="text" id="studentClass" className={formInputStyle} placeholder="e.g., 10A"/>
      </div>
      <Button type="submit" variant="primary" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Add Student</Button>
    </form>
  );
  
  const PostAnnouncementForm: React.FC = () => (
    <form className="space-y-4">
      <div>
        <label htmlFor="announcementTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Title</label>
        <input type="text" id="announcementTitle" className={formInputStyle} placeholder="Announcement Title"/>
      </div>
       <div>
        <label htmlFor="announcementContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">Content</label>
        <textarea id="announcementContent" rows={3} className={formInputStyle} placeholder="Detailed content..."/>
      </div>
      <Button type="submit" variant="primary" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Post Announcement</Button>
    </form>
  );


  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={mockStudents.length} icon={<Icons.Students className="w-6 h-6"/>} colorClass="text-academic-blue dark:text-blue-400 hc-accent-secondary-text" />
        <StatCard title="Total Staff" value={mockTeachers.length} icon={<Icons.Teachers className="w-6 h-6"/>} colorClass="text-accent-green dark:text-green-400 hc-accent-secondary-text" />
        <StatCard title="Fees Collected (This Month)" value={`₹${feeData.find(f=>f.name==='Paid')?.value || 0}`} icon={<Icons.Fees className="w-6 h-6"/>} colorClass="text-accent-yellow dark:text-yellow-400 hc-accent-primary-text" />
        <StatCard title="Pending Incidents" value={2} icon={<Icons.Bell className="w-6 h-6"/>} colorClass="text-red-500 dark:text-red-400 hc-accent-primary-text" description="2 Urgent"/>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" onClick={() => openModal('Add New Student', <AddStudentForm />)}>Add Student</Button>
          <Button variant="secondary" onClick={() => openModal('Post New Announcement', <PostAnnouncementForm />)}>Post Announcement</Button>
          <Button variant="outline">Assign Teacher</Button>
          <Button variant="ghost">Create Class</Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleBarChart data={feeData} title="Fee Collection Status" />
        </div>
        <AnnouncementsList announcements={mockAnnouncements.slice(0, 3)} title="Recent Announcements" />
      </div>

      <Card title="Incident Alerts">
        <div className="space-y-3">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 hc-bg-secondary hc-border-accent-primary hc-text-accent-primary-text">
            <p className="font-bold">Urgent: Water Leak in Library</p>
            <p className="text-sm">Reported 10 mins ago. Maintenance notified.</p>
          </div>
           <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300 hc-bg-secondary hc-border-accent-primary hc-text-accent-primary-text">
            <p className="font-bold">Warning: Bus #3 Delayed</p>
            <p className="text-sm">Expected delay of 20 minutes.</p>
          </div>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>

    </div>
  );
};

export default AdminOverviewContent;