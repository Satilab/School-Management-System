import React from 'react';
import { Icons } from '../../constants';
import Card from '../../components/ui/Card';

interface MinimalFeaturePageProps {
  title: string;
  description?: string;
  icon?: React.ReactElement;
}

const MinimalFeaturePage: React.FC<MinimalFeaturePageProps> = ({ 
  title, 
  description = "This feature is currently in development and will be available soon. We appreciate your patience!",
  icon = <Icons.Cog className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />
}) => {
  return (
    <Card className="text-center hc-bg-secondary">
      <div className="py-12 px-6">
        <div className="mx-auto mb-6 w-fit text-academic-blue dark:text-academic-blue hc-text-accent-secondary">
          {React.cloneElement(icon, { className: icon.props.className || "w-16 h-16" })}
        </div>
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 hc-text-primary mb-3">{title}</h1>
        <p className="text-md text-gray-500 dark:text-gray-400 max-w-lg mx-auto hc-text-secondary">{description}</p>
        <div className="mt-8">
            <p className="text-sm text-gray-400 dark:text-gray-500 hc-text-secondary">Thank you for using the {APP_NAME}.</p>
        </div>
      </div>
    </Card>
  );
};

import { APP_NAME } from '../../constants';

export default MinimalFeaturePage;