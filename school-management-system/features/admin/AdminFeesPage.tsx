import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Icons } from '../../constants';
import { Fee } from '../../types';
import { mockFees as initialMockFees, mockStudents } from '../../services/mockData';

const AdminFeesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<Fee[]>(initialMockFees);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Due' | 'Overdue'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);
  
  const formInputStyle = "px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm w-full " +
                         "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + // Light mode
                         "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " + // Dark mode
                         "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text"; // HC mode

  const formSelectStyle = "px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm w-full " +
                         "bg-white text-gray-900 border-gray-300 " + // Light mode
                         "dark:bg-gray-700 dark:text-white dark:border-gray-600 " + // Dark mode
                         "hc-bg-secondary hc-text-primary hc-border-primary"; // HC mode

  const handleMarkAsPaid = (feeId: string) => {
    const updatedFees = fees.map(fee =>
      fee.id === feeId ? { ...fee, status: 'Paid' as 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : fee
    );
    setFees(updatedFees);
    const globalFeeIndex = initialMockFees.findIndex(f => f.id === feeId);
    if(globalFeeIndex !== -1) {
        initialMockFees[globalFeeIndex] = { ...initialMockFees[globalFeeIndex], status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] };
    }
    alert(`Fee ID ${feeId} marked as Paid.`);
  };
  
  const filteredFees = fees.filter(fee => {
    const matchesStatus = filterStatus === 'All' || fee.status === filterStatus;
    const student = mockStudents.find(s => s.id === fee.studentId);
    const matchesSearch = searchTerm === '' || 
                          fee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (student && student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Fee Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Fee ID, Student ID/Name..."
            className={`${formInputStyle} sm:w-auto`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className={`${formSelectStyle} sm:w-auto`}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      <Card className="overflow-x-auto hc-bg-secondary">
        {filteredFees.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hc-divide-border-primary">
            <thead className="bg-gray-50 dark:bg-gray-700 hc-bg-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Fee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Amount (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hc-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 hc-bg-secondary hc-divide-border-primary">
              {filteredFees.map(fee => {
                const student = mockStudents.find(s => s.id === fee.studentId);
                return (
                    <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 hc-hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{fee.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{fee.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 hc-text-primary">{student?.name || fee.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{fee.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fee.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hc-bg-green-700 hc-text-white' :
                        fee.status === 'Due' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 hc-bg-yellow-500 hc-text-black' :
                        'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 hc-bg-red-600 hc-text-white'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hc-text-secondary">{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {fee.status !== 'Paid' && (
                        <Button size="sm" variant="primary" onClick={() => handleMarkAsPaid(fee.id)}>Mark Paid</Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => alert('Sending reminder (mock).')}>Send Reminder</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">No fee records found{ (searchTerm || filterStatus !== 'All') && ' matching your criteria'}.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminFeesPage;