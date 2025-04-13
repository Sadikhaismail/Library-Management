import React, { useState, useEffect } from 'react';
import API from "../Api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token"); // assuming token stored on login

        const userResponse = await API.get('api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        const historyResponse = await API.get('api/borrow/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBorrowingHistory(historyResponse.data.history);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error loading user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {user ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
              <p className="text-gray-700">Name: {user.name}</p>
              <p className="text-gray-700">Email: {user.email}</p>
            </div>
          ) : (
            <p className="text-red-400">User not found.</p>
          )}

          <h2 className="text-xl font-semibold mb-4">Borrowing History</h2>
          {borrowingHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {borrowingHistory.map((record, index) => (
                <div
                  key={record._id || index}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {record.book?.title || 'Unknown Title'}
                  </h3>
                  <p className="text-gray-600 font-bold">
                    Author: <span className="font-bold">{record.book?.author || 'Unknown Author'}</span>
                  </p>
                  <p className="text-gray-600 font-bold">
                    Borrowed on: {new Date(record.borrowedAt).toLocaleDateString()}
                  </p>
                  <p className="text-orange-600 font-bold">
                    Return by: {new Date(record.returnDate).toLocaleDateString()}
                  </p>
                  {record.returnedDate ? (
                    <p className="text-green-600 font-bold">
                      Returned on: {new Date(record.returnedDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-red-500 font-medium">Not Returned</p>
                  )}
                  {!record.returnedDate && new Date(record.returnDate) < new Date() && (
                    <p className="text-red-500 font-medium">Due Date Exceeded</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No borrowing history available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
