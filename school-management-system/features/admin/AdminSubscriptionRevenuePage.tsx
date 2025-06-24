import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import StatCard from '../../components/ui/StatCard';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import { Icons } from '../../constants';
import { PremiumFeature, ChartDataPoint } from '../../types';
import { mockSmsBalance, mockPremiumFeatures, mockMonthlyRevenue } from '../../services/mockData';

const AdminSubscriptionRevenuePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [smsBalance, setSmsBalance] = useState(0);
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeature[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<ChartDataPoint[]>([]);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const formElementStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-academic-blue focus:border-academic-blue sm:text-sm " + 
                           "bg-white text-gray-900 placeholder-gray-500 border-gray-300 " + 
                           "dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 " +
                           "hc-bg-secondary hc-text-primary hc-border-primary hc-placeholder-text";

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSmsBalance(mockSmsBalance);
      setPremiumFeatures(mockPremiumFeatures);
      setMonthlyRevenue(mockMonthlyRevenue);
      setLoading(false);
    }, 500);
  }, []);

  const handleToggleFeature = (featureId: string) => {
    setPremiumFeatures(prevFeatures =>
      prevFeatures.map(feature =>
        feature.id === featureId ? { ...feature, isActive: !feature.isActive } : feature
      )
    );
  };

  const handleRechargeSms = () => {
    const amount = parseInt(rechargeAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid recharge amount.");
      return;
    }
    setSmsBalance(prev => prev + amount);
    setIsRechargeModalOpen(false);
    setRechargeAmount('');
    alert(`Successfully recharged ${amount} SMS credits.`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 hc-text-primary">Subscription & Revenue Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="SMS Balance Management" className="hc-bg-secondary">
          <StatCard
            title="Current SMS Credits"
            value={smsBalance.toLocaleString()}
            icon={<Icons.Communication className="w-8 h-8" />}
            colorClass="text-academic-blue dark:text-blue-400 hc-accent-secondary-text"
          />
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={() => setIsRechargeModalOpen(true)}
          >
            Recharge SMS Credits
          </Button>
        </Card>

        <Card title="Monthly Premium Revenue" className="hc-bg-secondary">
            <SimpleBarChart data={monthlyRevenue} title="Revenue (Past 6 Months)" />
        </Card>
      </div>

      <Card title="Premium Parent Features" className="hc-bg-secondary">
        <div className="space-y-4">
          {premiumFeatures.map(feature => (
            <div key={feature.id} className="p-4 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-700 shadow-sm hc-bg-secondary hc-border-primary">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hc-text-primary">{feature.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 hc-text-secondary">{feature.description}</p>
                {feature.monthlyPrice && <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">Price: ₹{feature.monthlyPrice}/month</p>}
              </div>
              <label htmlFor={`toggle-${feature.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`toggle-${feature.id}`}
                    className="sr-only"
                    checked={feature.isActive}
                    onChange={() => handleToggleFeature(feature.id)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${feature.isActive ? 'bg-academic-blue dark:bg-blue-600 hc-bg-accent-primary' : 'bg-gray-300 dark:bg-gray-600 hc-bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${feature.isActive ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 dark:text-gray-200 hc-text-primary text-sm font-medium">
                  {feature.isActive ? 'Active' : 'Inactive'}
                </div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isRechargeModalOpen} onClose={() => setIsRechargeModalOpen(false)} title="Recharge SMS Credits">
        <div className="space-y-4">
          <div>
            <label htmlFor="rechargeAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text-secondary">
              Enter Amount (Number of Credits)
            </label>
            <input
              type="number"
              id="rechargeAmount"
              name="rechargeAmount"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className={formElementStyle}
              placeholder="e.g., 5000"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">Note: This is a mock recharge. No real payment will be processed.</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setIsRechargeModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRechargeSms}>Recharge</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSubscriptionRevenuePage;