import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {user.firstName} {user.lastName}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/doctors')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Find a Doctor
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/medicines')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Order Medicines
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/specialities')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Browse Specialties
                  </button>
                </li>
              </ul>
            </div>

            {/* User Information */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Your Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 