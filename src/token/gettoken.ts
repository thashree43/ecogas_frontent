import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import extractToken from "./extracttoken";
import type { DecodedToken } from "../interfacetypes/type";
import { RootState } from '../store/store';

const getCookieByName = (name: string): string | undefined => {
    const cookieMatch = document.cookie.match(`(^|;)\\s*${name}=([^;]+)`);
    return cookieMatch ? decodeURIComponent(cookieMatch[2]) : undefined;
};

// Custom hook to get the token using useSelector
export const useGetToken = (name: string): DecodedToken | null => {
  try {
    const token = useSelector((state: RootState) => state.user.token);

    if (token) {
      const userDetail = extractToken(token);
      console.log("Extracted user details:", userDetail);
      return userDetail;
    }

    // Fallback to cookies
    const cookieToken = Cookies.get(name) || getCookieByName(name);
    if (!cookieToken) {
      console.log("No token found in cookies");
      return null;
    }

    const userDetail = extractToken(cookieToken);
    console.log("Extracted user details from cookie:", userDetail);
    return userDetail;
  } catch (error) {
    console.error("Error in useGetToken:", error);
    return null;
  }
};
  