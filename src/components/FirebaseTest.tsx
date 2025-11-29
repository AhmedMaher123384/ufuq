import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FirebaseTest: React.FC = () => {
  const [testStatus, setTestStatus] = useState<string>('Testing...');
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      // Test connection by adding a test document
      const testDoc = {
        message: 'Firebase connection test',
        timestamp: serverTimestamp(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'test'), testDoc);
      setTestStatus('Connected successfully!');
      setTestResult({ id: docRef.id, message: 'Test document added to Firestore' });
      
      console.log('Firebase connection successful!', docRef.id);
    } catch (error) {
      setTestStatus('Connection failed');
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
      console.error('Firebase connection error:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Status:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            testStatus === 'Connected successfully!' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {testStatus}
          </span>
        </p>
        {testResult && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium">Result:</p>
            <pre className="text-xs mt-1 text-gray-600">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest;