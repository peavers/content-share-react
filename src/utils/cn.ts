import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for conditionally joining classNames
 * Similar to clsx but simplified for our use case
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}