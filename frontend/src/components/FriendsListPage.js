import React from "react";
import { useLocation } from "react-router-dom";

const FriendsList = () => {
  const { state } = useLocation();
  const friends = state?.friends || [];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Friends List
      </h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              First Name
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Last Name
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Phone Number
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <tr
                key={index}
                className="hover:bg-blue-100 dark:hover:bg-blue-600 transition duration-300"
              >
                <td className="py-3 px-6 border-b border-gray-200">
                  {friend.firstname}
                </td>
                <td className="py-3 px-6 border-b border-gray-200">
                  {friend.lastname}
                </td>
                <td className="py-3 px-6 border-b border-gray-200">
                  {friend.phonenumber}
                </td>
                <td className="py-3 px-6 border-b border-gray-200">
                  {friend.address}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="py-3 px-6 text-center border-b border-gray-200"
              >
                <span className="text-gray-500">No friends found.</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FriendsList;
