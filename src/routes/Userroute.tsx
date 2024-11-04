import React from "react";
import { Route, Routes } from "react-router-dom";
import Mainlayout from "../layouts/Mainlayout";
import Homepage from "../compnents/user/mainpages/Homepage";
import Changepassword from "../compnents/user/mainpages/Changepassword";
import ResetPasswordForm from "../compnents/user/mainpages/NewPassword";
import UserProductroute from "../routes/protectroute/UserProductRoute";
import UserVerifyroute from "./protectroute/UserVerifyroute";
import GasBookingPage from "../compnents/user/mainpages/Bookingpage";
import BookingProfilePage from "../compnents/user/profile/Profilepage";

const UserRoute: React.FC = () => {
  return (
    <Routes>
      

      <Route
        path="/"
        element={
          <UserVerifyroute
            component={() => (
              <Mainlayout>
                <Homepage />
              </Mainlayout>
            )}
          />
        }
      />
      <Route
        path="/home"
        element={
          <UserProductroute
            component={() => (
              <Mainlayout>
                <Homepage />
              </Mainlayout>
            )}
          />
        }
      />
      <Route
        path="/resetpassword"
        element={
          <UserVerifyroute
          component={() => (
            <Mainlayout>
              <Changepassword/>
            </Mainlayout>
          )}          />
        }
      />
      <Route
        path="/updatepassword/:token"
        element={
          <UserVerifyroute
          component={() => (
            <Mainlayout>
              <ResetPasswordForm/>
            </Mainlayout>
          )}           />
        }
      />
      <Route
        path="/book-gas"
        element={
            <Mainlayout>
            <GasBookingPage />
          </Mainlayout>
        }
      />
     <Route path="/profile" element={
  <BookingProfilePage/>
     }/>

    </Routes>
  );
};

export default UserRoute;