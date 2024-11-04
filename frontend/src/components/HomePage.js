import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaUserPlus, FaUserFriends } from "react-icons/fa";

const HomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [darkMode, setDarkMode] = useState(false);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [newFriend, setNewFriend] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [tooltip, setTooltip] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8000/data", {
          withCredentials: true,
        });
        setUserInfo(response.data);
        setCurrentTime(new Date().toLocaleString());
      } catch (err) {
        setError("Failed to load user data");
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:8000/friends", {
          withCredentials: true,
        });
        setFriends(response.data);
      } catch (err) {
        setError("Failed to load friends list");
      }
    };

    fetchUserInfo();
    fetchFriends();
  }, []);

  const handleEditProfile = () => {
    navigate("/editProfileUrl");
  };

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleAddFriend = async () => {
    const { firstname, lastname, phonenumber, address } = newFriend;
    if (!firstname || !lastname || !phonenumber || !address) {
      alert("Please fill in all fields.");
      return; 
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phonenumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return; 
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/add-friend",
        { ...newFriend, userId: userInfo._id },
        { withCredentials: true }
      );
      const friendsResponse = await axios.get("http://localhost:8000/friends", {
        withCredentials: true,
      });
      setFriends(friendsResponse.data);
      alert("Friend added successfully!");
      setNewFriend({
        firstname: "",
        lastname: "",
        phonenumber: "",
        address: "",
      });
      setShowAddFriendForm(false);
    } catch (err) {
      console.error("Error adding friend:", err);
      setError("Failed to add friend");
    }
  };

  const handleShowFriendsList = () => {
    navigate("/friends", { state: { friends } }); 
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${
        darkMode ? "dark" : ""
      } ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black-800"}`}
    >
      <button
        onClick={toggleTheme}
        onMouseEnter={() => setTooltip("Toggle Dark/Light Mode")}
        onMouseLeave={() => setTooltip("")}
        className="absolute top-4 right-16 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full p-2 shadow-md hover:shadow-lg transition"
      >
        {darkMode ? <FaMoon /> : <FaSun />}
      </button>

      <button
        onClick={() => {
          setShowAddFriendForm(true);
          setTooltip("");
        }}
        onMouseEnter={() => setTooltip("Add a Friend")}
        onMouseLeave={() => setTooltip("")}
        className="absolute top-4 right-28 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md transition"
      >
        <FaUserPlus />
      </button>

      <button
        onClick={handleShowFriendsList}
        onMouseEnter={() => setTooltip("Show Friends List")}
        onMouseLeave={() => setTooltip("")}
        className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-md transition"
      >
        <FaUserFriends />
      </button>

      {tooltip && (
        <div className="absolute top-16 right-16 bg-gray-700 text-white text-sm p-2 rounded z-10 whitespace-nowrap shadow-md">
          {tooltip}
        </div>
      )}

      {showAddFriendForm && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-10 w-full max-w-xs transition-transform transform translate-y-0">
          <h2 className="text-xl font-semibold mb-4">Add Friend</h2>
          {["firstname", "lastname", "phonenumber", "address"].map(
            (placeholder, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={newFriend[placeholder.toLowerCase().replace(" ", "")]}
                  onChange={(e) =>
                    setNewFriend({
                      ...newFriend,
                      [placeholder.toLowerCase().replace(" ", "")]:
                        e.target.value,
                    })
                  }
                  className={`border rounded p-2 w-full outline-none focus:ring focus:ring-blue-400 transition ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                  required
                />
              </div>
            )
          )}
          <button
            onClick={handleAddFriend}
            className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 mt-2 w-full transition"
          >
            Add Friend
          </button>
          <button
            onClick={() => setShowAddFriendForm(false)}
            className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mt-2 w-full transition"
          >
            Cancel
          </button>
        </div>
      )}

      {showFriendsList && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-10 w-full max-w-xs transition-transform transform translate-y-0">
          <h2 className="text-xl font-semibold mb-4">Friends List</h2>
          {friends.length > 0 ? (
            <ul className="list-disc pl-5">
              {friends.map((friend, index) => (
                <li key={index} className="dark:text-gray-300">
                  {friend.firstname} {friend.lastname} - {friend.phonenumber} -{" "}
                  {friend.address}
                </li>
              ))}
            </ul>
          ) : (
            <p className="dark:text-gray-300">No friends found.</p>
          )}
          <button
            onClick={() => setShowFriendsList(false)}
            className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mt-2 w-full transition"
          >
            Close
          </button>
        </div>
      )}

      {userInfo ? (
        <div
          className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <h1 className="text-3xl font-semibold mb-4 text-center dark:text-white">
            Welcome
          </h1>
          <div className="flex items-center justify-center mb-4 relative group">
            <img
              src={
                userInfo?.profileUrl ||
                "https://tse3.mm.bing.net/th?id=OIP.k5v9RvIOevmRxV5J9i9TJQHaHa&pid=Api&P=0&h=180"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg"
            />
            <button
              onClick={handleEditProfile}
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              Edit
            </button>
          </div>
          <p className="text-xl font-bold text-center">
            {userInfo.firstname} {userInfo.lastname}
          </p>
          <p className="text-center">Email : {userInfo.email}</p>
          <p className="text-center">Login at : {currentTime}</p>
        </div>
      ) : (
        <p className="text-center text-red-500">Loading user data...</p>
      )}
    </div>
  );
};

export default HomePage;
