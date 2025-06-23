import React from 'react';
import ChallengeBlock from './blocks/ChallengeBlock';
import SupportBlock from './blocks/SupportBlock';
import PublishedBlock from './blocks/PublishedBlock';

const ActionButtons: React.FC = () => {
  return (
    <section 
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      aria-labelledby="actions-heading"
    >
      <div className="text-center mb-12">
        <h3 
          id="actions-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
        >
          How can I help you today?
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose what you need right now. I'm here to support your creative journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-down">
        <ChallengeBlock />
        <SupportBlock />
        <PublishedBlock />
      </div>
    </section>
  );
};

export default ActionButtons;