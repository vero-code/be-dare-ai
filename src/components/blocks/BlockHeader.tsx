import React from 'react';
import { Lightbulb } from 'lucide-react';

interface BlockHeaderProps {
  icon?: React.ReactNode;
  bgColor?: string;
  title: string;
  description: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  icon = <Lightbulb className="w-8 h-8 text-white" />, // default icon
  bgColor = 'bg-indigo-500 hover:bg-indigo-600',
  title,
  description
}) => (
  <>
    <div className="text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
    <h4 className="text-xl font-bold text-gray-900 mb-2">
      {title}
    </h4>
    <p className="text-gray-600 mb-6 leading-relaxed">
      {description}
    </p>
  </>
);

export default BlockHeader;
