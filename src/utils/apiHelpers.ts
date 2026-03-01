// Utility function for handling API errors
export const handleApiError = (error: any, context: string = 'Operation') => {
  console.error(`${context} error:`, error.response?.data || error);
  
  const errorMsg = error.response?.data?.message || error.message || `${context} failed`;
  const displayMsg = Array.isArray(errorMsg) ? errorMsg.join('\n') : errorMsg;
  
  return displayMsg;
};

// Utility function for logging API requests
export const logApiRequest = (endpoint: string, payload: any) => {
  if (__DEV__) {
    console.log(`API Request to ${endpoint}:`, payload);
  }
};
