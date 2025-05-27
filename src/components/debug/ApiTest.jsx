import React from 'react';
import { API_ENDPOINTS } from '../config/api';

const ApiTest = () => {
  const testConnection = async () => {
    try {
      console.log('🧪 Testing connection to:', API_ENDPOINTS.AUTH.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        }),
      });
      
      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📋 Response data:', data);
      
      alert(`Connection test: Status ${response.status}, Message: ${data.message || 'No message'}`);
    } catch (error) {
      console.error('🚨 Connection test failed:', error);
      alert(`Connection failed: ${error.message}`);
    }
  };
  const testHealthEndpoint = async () => {
    try {
      console.log('🏥 Testing health endpoint...');
      
      const response = await fetch(`${window.location.origin}/api/health`);
      const data = await response.json();
      
      console.log('✅ Health check response:', data);
      alert(`Health check: ${data.message}`);
    } catch (error) {
      console.error('🚨 Health check failed:', error);
      alert(`Health check failed: ${error.message}`);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
      <button 
        onClick={testConnection}
        style={{ 
          margin: '5px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        🧪 Test Login API
      </button>
      <button 
        onClick={testHealthEndpoint}
        style={{ 
          margin: '5px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        🏥 Test Health
      </button>
    </div>
  );
};

export default ApiTest;
