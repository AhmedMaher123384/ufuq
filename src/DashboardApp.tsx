import React from 'react';
import Dashboard from './components/Dashboard';

const DashboardApp: React.FC = () => {
  return (
    <div dir="rtl">
      <Dashboard isRTL={true} />
    </div>
  );
};

export default DashboardApp;