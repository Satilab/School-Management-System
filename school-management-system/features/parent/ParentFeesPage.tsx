import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Student, Fee } from '../../types';
import { getChildrenOfParent, getFeesForStudent, mockFees as initialMockFees } from '../../services/mockData';
import { Icons } from '../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';

interface ParentFeesPageProps {
  parentId: string;
}

const ParentFeesPage: React.FC<ParentFeesPageProps> = ({ parentId }) => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Student[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [selectedChildId, setSelectedChildId] = useState<string>(queryParams.get('childId') || '');
  const [childFees, setChildFees] = useState<Fee[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

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
    if (selectedChildId) {
      setLoading(true);
      setChildFees(getFeesForStudent(selectedChildId));
       if (queryParams.get('childId') !== selectedChildId) {
        navigate(`${location.pathname}?childId=${selectedChildId}`, { replace: true });
      }
      setLoading(false);
    } else {
        setChildFees([]);
    }
  }, [selectedChildId, location.pathname, navigate]);

  const openPaymentModal = (fee: Fee) => {
    setSelectedFee(fee);
    setIsPaymentModalOpen(true);
  };

  const handleMockPayment = () => {
    if (selectedFee) {
      // Mock update: In a real app, this would involve API calls and payment gateway integration.
      const updatedFees = childFees.map(f =>
        f.id === selectedFee.id ? { ...f, status: 'Paid' as 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : f
      );
      setChildFees(updatedFees);
      
      const globalFeeIndex = initialMockFees.findIndex(f => f.id === selectedFee.id);
      if(globalFeeIndex !== -1) {
        initialMockFees[globalFeeIndex] = { ...initialMockFees[globalFeeIndex], status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] };
      }
      setIsPaymentModalOpen(false);
      setSelectedFee(null);
      alert(`Mock payment of ₹${selectedFee.amount} for ${selectedChild?.name} processed successfully!`);
    }
  };
  
  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Fee Payment</h1>

       {children.length > 0 && (
        <div className="mb-6">
            <label htmlFor="childSelectFees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary mb-1">Select Child:</label>
            <select
                id="childSelectFees"
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

      {loading && <Spinner />}

      {!loading && selectedChild && (
        <Card title={`Fee Details for ${selectedChild.name}`} className="hc-bg-secondary">
          {childFees.length > 0 ? (
            <ul className="space-y-4">
              {childFees.map(fee => (
                <li key={fee.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700/50 hc-bg-secondary">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 hc-text-primary">Term Fee: ₹{fee.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">Due Date: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      {fee.status === 'Paid' && fee.paymentDate && (
                        <p className="text-sm text-green-600 dark:text-green-300 hc-text-accent-secondary-text">Paid on: {new Date(fee.paymentDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0 flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            fee.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 hc-bg-green-700 hc-text-white' :
                            fee.status === 'Due' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 hc-bg-yellow-500 hc-text-black' :
                            'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 hc-bg-red-600 hc-text-white'
                        }`}>
                            {fee.status}
                        </span>
                        {fee.status !== 'Paid' && (
                            <Button size="sm" variant="primary" onClick={() => openPaymentModal(fee)}>
                            <Icons.Fees className="w-4 h-4 mr-2"/> Pay Now
                            </Button>
                        )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 hc-text-secondary text-center py-6">No fee records found for {selectedChild.name}.</p>
          )}
        </Card>
      )}
      {!loading && children.length === 0 && (
         <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">No children linked to view fees.</p></Card>
      )}
       {!loading && children.length > 0 && !selectedChildId && (
         <Card className="hc-bg-secondary"><p className="text-center text-gray-500 dark:text-gray-400 hc-text-secondary py-8">Please select a child to view their fee details.</p></Card>
      )}

      {/* Payment Modal */}
      {selectedFee && selectedChild && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={`Confirm Payment for ${selectedChild.name}`} size="md">
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300 hc-text-secondary">You are about to make a mock payment for:</p>
            <p className="text-gray-700 dark:text-gray-300 hc-text-secondary"><strong>Fee Type:</strong> Term Fee</p>
            <p className="text-gray-700 dark:text-gray-300 hc-text-secondary"><strong>Amount:</strong> ₹{selectedFee.amount.toLocaleString()}</p>
            <p className="text-gray-700 dark:text-gray-300 hc-text-secondary"><strong>Due Date:</strong> {new Date(selectedFee.dueDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary mt-4">
              Note: This is a simulated payment. No real transaction will occur.
            </p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleMockPayment}>Proceed with Mock Payment</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ParentFeesPage;