// Utility function for handling API errors
export const handleApiError = (error: any, context: string = 'Operation') => {
  console.error(`❌ ${context} error:`, error.response?.data || error);
  
  // Extract error message from various possible locations
  let errorMsg = 'An error occurred';
  
  if (error.response?.data) {
    const data = error.response.data;
    
    // Check for message field (most common)
    if (data.message) {
      errorMsg = Array.isArray(data.message) ? data.message.join('\n• ') : data.message;
    }
    // Check for error field
    else if (data.error) {
      errorMsg = data.error;
    }
    // Check for errors array (validation errors)
    else if (data.errors && Array.isArray(data.errors)) {
      errorMsg = data.errors.map((e: any) => e.message || e).join('\n• ');
    }
  } 
  // Network or other errors
  else if (error.message) {
    if (error.message.includes('Network')) {
      errorMsg = 'Network error. Please check your internet connection.';
    } else {
      errorMsg = error.message;
    }
  }
  
  // Add context if error message doesn't already include it
  const finalMsg = errorMsg.toLowerCase().includes(context.toLowerCase()) 
    ? errorMsg 
    : `${context} failed: ${errorMsg}`;
  
  return finalMsg;
};

// Utility function for logging API requests
export const logApiRequest = (endpoint: string, payload: any) => {
  if (__DEV__) {
    console.log(`📤 API Request to ${endpoint}:`, payload);
  }
};
