import React from 'react';
import {
  Infinity,
  Undo2,
  Zap,
  EyeOff,
  Heart,
  MessageCircle,
  LucideIcon
} from 'lucide-react-native';

/**
 * Get the appropriate icon component for a feature
 * @param iconName The name of the icon to retrieve
 * @returns The Lucide icon component
 */
export const getFeatureIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'infinity':
      return Infinity;
    case 'undo-2':
      return Undo2;
    case 'zap':
      return Zap;
    case 'eye-off':
      return EyeOff;
    case 'heart':
      return Heart;
    case 'message-circle':
      return MessageCircle;
    default:
      return Infinity; // Default fallback icon
  }
};

export { getFeatureIcon }