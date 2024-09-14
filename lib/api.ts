export const increaseApiLimit = async () => {
    try {
      const response = await fetch('/api/increase-api-limit', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Failed to increase API limit');
      }
    } catch (error) {
      console.error('Error in increaseApiLimit:', error);
    }
  };
  
  export const checkApiLimit = async () => {
    try {
      const response = await fetch('/api/check-api-limit', {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to check API limit');
      }
  
      const { isAllowed, count } = await response.json();  
      return { isAllowed, count };
    } catch (error) {
      console.error('Error in checkApiLimit:', error);
      return { isAllowed: false, count: 0 }; 
    }
  };
  
  export const activateSubscription = async () => {
    try {
      const response = await fetch('/api/webhook', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Failed to activate subscription');
      }
    } catch (error) {
      console.error('Error in activateSubscription:', error);
    }
  };