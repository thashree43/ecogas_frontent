import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { baseurluser } from "../api";
import { HttpMethod } from "../../schema/httpmethod";

interface User {
  success: any;
  _id: string;
  username: string;
  email: string;
  is_blocked: boolean;
  book: Array<{
    _id: string;
    name: string;
    consumerid: number;
    mobile: number;
    address: string;
    company: string;
    gender: string;
  }>;
  orders: Array<Order>;
}

interface Order {
  _id: string;
  name: string;
  address: string;
  mobile: number;
  consumerid: number;
  company: string;
  price: number;
  paymentmethod: string;
  expectedat: Date;
  status: string;
}

interface GasProvider {
  _id: string;
  agentname: string;
  email: string;
  mobile: string;
  pincode: string;
  products: Array<{
    _id: string;
    companyname: string;
    weight: number;
    price: number;
    quantity: number;
  }>;
}
interface Message {
  _id: string; 
  content: string;
  sender: string; 
  createdAt: Date; 
}
type Messages = Message[];
interface RefreshTokenResponse {
  token: string;
}
const baseQuery = fetchBaseQuery({
  baseUrl: baseurluser,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('userToken='))
      ?.split('=')[1];

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Token expired, attempting to refresh...");

    const refreshResult = await baseQuery(
      { url: '/userrefresh-token', method: 'POST' ,credentials:"include"},
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as RefreshTokenResponse).token;

      
      localStorage.setItem("userToken", newToken);

      const fetchArgs = typeof args === 'string' ? { url: args } : args;

      let newHeaders: HeadersInit;
      
      if (fetchArgs.headers instanceof Headers) {
        newHeaders = new Headers(fetchArgs.headers);
      } else if (Array.isArray(fetchArgs.headers)) {
        newHeaders = fetchArgs.headers.reduce((acc, [key, value]) => {
          if (key && value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
      } else if (typeof fetchArgs.headers === 'object' && fetchArgs.headers !== null) {
        newHeaders = fetchArgs.headers as Record<string, string>;
      } else {
        newHeaders = {};
      }

      if (newHeaders instanceof Headers) {
        newHeaders = Object.fromEntries(newHeaders.entries());
      }

      newHeaders = {
        ...newHeaders,
        'Authorization': `Bearer ${newToken}`
      };


      result = await baseQuery(
        {
          ...fetchArgs,
          headers: newHeaders,
        },
        api,
        extraOptions
      );
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};

export const userApislice = createApi({
  reducerPath: "userApi",
  baseQuery:baseQueryWithReauth,
  tagTypes: ['User','GasProviders'],
  endpoints: (builder) => ({
    registerPost: builder.mutation({
      query: (formData) => ({
        url: "/register",
        method: HttpMethod.POST,
        body: formData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ otp, email }) => ({
        url: "/verifyotp",
        method: "POST",
        body: { otp, email },
      }),
    }),
    resentotp: builder.mutation({
      query: (email) => ({
        url: "/resentotp",
        method: "POST",
        body: { email },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: { email, password },
        credentials:"include"
      }),
      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Login failed:', error);
        }
      }
    }),
    refreshtoken:builder.mutation({
      query:()=>({
        url:"/userrefresh-token",
        method:"POST"
      })
    }),
    googleregister: builder.mutation({
      query: (postData) => ({
        url: "/google-login",
        method: "POST",
        body: { postData },
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resendotp",
        method: "POST",
        body: { email },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/resetpassword",
        method: "POST",
        body: { email },
      }),
    }),
    resetpassword: builder.mutation({
      query: (postdata) => ({
        url: "/updatepassword",
        method: "PATCH",
        body: postdata,
      }),
    }),
    logout:builder.mutation<void,void>({
      query:()=>({
        url:"/logout",
        method:"POST",
      })
    }),
     getProviders: builder.query<GasProvider[], string>({
      query: (pincode) => `/gas-providers/${pincode}`,
      providesTags: ['GasProviders'],
    }),
    
    addbook:builder.mutation({
      query:(formdata)=>({
        url:'/addbook',
        method:"POST",
        body:formdata
      })
    }),
    getbook: builder.query<User, string>({
      query: (userId) => `/getbook/${userId}`,
      transformResponse: (response: { success: boolean; books: User['book'] }) => {
        return {
          success: response.success,
          _id: '', 
          username: '',
          email: '',
          is_blocked: false,
          book: response.books,
          orders: [],
        };
      },
      providesTags: ["User"],
    }),
    deletebook: builder.mutation({
      query: (bookId) => ({
        url: `/deletebook/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    orderthegas:builder.mutation({
      query:(bookingData)=>({
        url:'/ordergas',
        method:"POST",
        body:bookingData
      })
    }),
    getorders: builder.query<{ orders: Order[] }, string>({
      query: (userId) => `/getorders/${userId}`,
    }),
    userchat: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/userchat/${userId}`,
        method: "POST"
      })
    }),
    sendmessage: builder.mutation({
      query: (formData) => ({
          url: "/sendmessages",
          method: "POST",
          body: formData,
          formData: true
        }),
      
    }),
    
    getmessages:builder.query<Messages, string>({
      query:(chatId)=>`/getmessage/${chatId}`
    })
  }),
});

export const {
  useRegisterPostMutation,
  useVerifyOtpMutation,
  useResentotpMutation,
  useLoginMutation,
  useRefreshtokenMutation,
  useGoogleregisterMutation,
  useForgotPasswordMutation,
  useResetpasswordMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useGetProvidersQuery,
  useAddbookMutation,
  useGetbookQuery,
  useDeletebookMutation,
  useOrderthegasMutation,
  useGetordersQuery,
 useUserchatMutation,
 useSendmessageMutation,
useGetmessagesQuery,

  
} = userApislice;
 