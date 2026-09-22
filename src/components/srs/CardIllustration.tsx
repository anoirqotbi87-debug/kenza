import React from 'react';
import * as Icons from 'lucide-react';
import { CardIllustration as CardIllustrationType } from '../../types/srs';

interface Props {
  illustration?: CardIllustrationType;
}

export default function CardIllustration({ illustration }: Props) {
  if (!illustration || !illustration.iconName) return null;
  
  // Dynamically load the Lucide icon based on string name
  const IconComponent = (Icons as any)[illustration.iconName];
  
  if (!IconComponent) return null;

  return (
    <div className="bg-blue-50 text-blue-600 border border-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
      <IconComponent className="w-8 h-8 stroke-[1.5]" />
    </div>
  );
}
