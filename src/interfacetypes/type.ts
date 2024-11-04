import { LucideIcon } from "lucide-react";
// {Agent datas

export interface CompanyData {
  _id?: string;
  companyname: string;
  weight: number;
  price: number;
  quantity: number;
}
export interface Agent {
  _id: string;
  agentname: string;
  email: string;
  mobile: number;
  password: string;
  pincode: number;
  is_Approved: boolean;
  image: string;
  products: CompanyData[];
  orders: Order[];
}

export interface AgentLoginResponse {
  success: boolean;
  agent: {
    agentId: string;
    agentname: string;
    email: string;
    mobile: number;
    pincode: number;
  };
  token: string;
}

export interface CustomFormData {
  username: string;
  email: string;
  mobile: string;
  password: string;
  profileImage?: File;
  pincode: string;
}

export interface FormData {
  email: string;
  password: string;
}

export interface FormErrors {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
  profileImage?: string;
  pincode?: string;
}

// Agent datas}

// {Orderdata
export interface Order {
  createdAt?: string | number | Date;
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
export interface Orderdatas {
  _id: string;
  name: string;
  company: string;
  address: string;
  paymentmethod: string;
  expectedat: Date;
  status: string;
  price: number;
}
export interface OrderResponse {
  orders: any;
  success: boolean;
  result: {
    orders: Order[];
  };}

export interface Books{
  _id: string;
  name: string;
  consumerid: number;
  mobile: number;
  address: string;
  company: string;
}

export interface GasBookListProps {
  books: Books[];
  isLoading: boolean;
  isError: boolean;
  handleDelete: (id: string) => void;
  setIsModalOpen: (open: boolean) => void;
}
export interface MenuItemProps {
  Icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}
export interface ComponentProps {
  icon?: any;
  text?: string;
  active?: boolean;
  title?: string;
  value?: string | number;
  onClick?: () => void;
}
// Define the function props interface properly
export interface FunctionData {
  refetch: () => void;
  closeModal: () => void;
}

// Define the props expected by ProductEditingForm
export interface ProductEditingFormProps {
  initialProduct: Product;
  onEdit: (updatedProduct: Product) => Promise<void>;
  refetch: () => void;
  closeModal: () => void;
}

// Product interface should extend CompanyData
export interface Product extends CompanyData {
  _id: string;
}


// {User
export interface User {
  _id: string;
  username: string;
  email: string;
  is_blocked: boolean;
}
// User}


// {GasProvide
export interface GasProvider {
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
// Gasprovider}

// {CustomerDetails
export interface CustomerDetails {
  name: string;
  consumerId: string;
  mobile: string;
  address: string;
}
// CustomerDetails}

// {success props}
export interface SuccessMessageProps {
  showSuccessMessage: boolean;
  setShowSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>;
}
// successprops}

//messages
export interface Message {
  _id: string;
  content: string;
  sender: string;
  chat?: { _id: string }[];
  createdAt: Date;
  text?: string;
  image?: string | null; // Allow image to be null
  timestamp?: Date;
}

export interface Chat {
  _id: string;
  chatname: string;
  user: { username: string }[];
  admin:{ _id:string,username: string }[]
  latestmessage?: { content: string }[]; // Marking latestmessage as optional
  updatedAt?: string; // Marking updatedAt as optional
}

export interface ChatPageProps {
  onClose: () => void;
  selectedChatId?: string;
}

export interface Messagecustomexp {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username?: string;
  }[];
  chat: {
    _id: string;
  }[];
  createdAt: Date;
  image?: string | null;
}

export interface Chatcustomexp {
  _id: string;
  chatname: string;
  user: { username: string }[];
  admin: { _id: string; username: string }[];
  latestmessage?: { content: string }[];
  updatedAt?: string;
}

export interface MessageContentProps {
  message: Messagecustomexp;
}
// Loginresponce 
export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  admin?: {
    _id: string;
    email: string;
  };
}
export interface IAdminData {
  _id: string;
  username: string;
  email: string;
  mobile: number | null;
  password: string;
  is_blocked: boolean;
  is_admin: boolean;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface loginResponse {
  success: boolean;
  admin: IAdminData;
  token: string;
}
// Sale interface representing the sales data
export interface Sale {
  _id: string;
  amount: number;
  productName: string;
  date: string;
  agent: {
    name: string;
  };
}


// chart for dashboard
export interface DashboardData {
  activeTickets: number;
  todaysAppointments: number;
  pendingReviews: number;
  monthlyDistribution: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  value: number;
}
export interface MonthlySales {
  month: string; // or number, based on your response
  totalOrdersAmount: number;
  totalProfit: number;
}

export interface AdminDashboardData {
  totalOrdersAmount: number;
  totalProfit: number;
  monthlySales: MonthlySales[];
  totalAgentCount: number;
  totalOrdersCount: number;
}

export interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface FormDatas {
  name: string;
  consumerId: number;
  mobile: number;
  address: string;
  company: string;
  gender: string;
}

export interface FormField {
  name: keyof FormDatas;
  label: string;
}
export interface DashboardDatas {
  totalSales: number;
  totalProfit: number;
  monthlyData: {
    month: string;
    sales: number;
    profit: number;
  }[];
  orders: any[]; // Add this if you need orders data
}