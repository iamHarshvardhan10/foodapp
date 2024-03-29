// import {} from '../redux/user/userSlice'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Link } from "react-router-dom";

import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateFailure());
      }
      dispatch(updateSuccess(data));
      console.log(data);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const deleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signOut");
      const data = await res.json();
      console.log(data);
      if (data.success == false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      localStorage.clear();
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="profileContainer">
      <div className="insideContainer">
        <div className="TopProfileContainer">
          <span>Glad To see You On Board!</span>
          <span>
            We take pride in offering unparalleled customer support to ensure
            your experience with our Delicious Food.
          </span>
          {currentUser.email === "admin123@gmail.com" ? (
            <div className="links">
              <Link to="/admin-dashboard">
                <p>Admin Dashboard</p>
              </Link>
            </div>
          ) : null}
        </div>
        <div className="BottomProfileContainer">
          <h3>Your Profile Showcase!!!</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="userName"
              id="userName"
              defaultValue={currentUser.userName}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
            <div className="btns">
              <button type="submit">Update</button>
              <button className="btn" onClick={deleteUser}>
                Delete Account
              </button>
              <button className="btn" onClick={handleSignOut}>
                Sing Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
