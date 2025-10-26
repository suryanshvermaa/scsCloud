// Simple notification utility to replace alert()
export const notifier = {
  success: (message: string) => {
    // For now, using alert but this can be replaced with a toast library later
    alert(`✓ ${message}`);
  },
  
  error: (message: string) => {
    alert(`✗ ${message}`);
  },
  
  info: (message: string) => {
    alert(`ℹ ${message}`);
  },
  
  warning: (message: string) => {
    alert(`⚠ ${message}`);
  }
};
