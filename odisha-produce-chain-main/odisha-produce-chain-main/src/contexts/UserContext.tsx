import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: 'farmer' | 'distributor' | 'retailer' | 'customer';
  
  // Role-specific information
  farmName?: string;
  farmAddress?: string;
  farmSize?: string;
  farmType?: string;
  cropsGrown?: string;
  experience?: string;
  certification?: string;
  
  // Distributor specific
  companyName?: string;
  businessAddress?: string;
  licenseNumber?: string;
  distributionAreas?: string;
  vehicleDetails?: string;
  
  // Retailer specific
  storeName?: string;
  storeAddress?: string;
  businessType?: string;
  gstNumber?: string;
  
  // Customer specific
  address?: string;
  preferences?: string;
  
  // Registration date
  registeredAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem('agrichain_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (userData: UserProfile | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem('agrichain_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('agrichain_user');
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    updateUser,
    isLoggedIn: !!user,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Demo user data for testing
export const demoUsers: Record<string, UserProfile> = {
  farmer: {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "farmer@gmail.com",
    phone: "+91 9876543210",
    dateOfBirth: "1985-06-15",
    role: "farmer",
    farmName: "Green Valley Farm",
    farmAddress: "Village Rampur, District Meerut, Uttar Pradesh",
    farmSize: "25 acres",
    farmType: "Organic Farm",
    cropsGrown: "Wheat, Rice, Sugarcane, Potato",
    experience: "15 years",
    certification: "Organic Certified (NPOP)",
    registeredAt: "2024-01-15"
  },
  distributor: {
    firstName: "Amit",
    lastName: "Singh",
    email: "distributor@gmail.com",
    phone: "+91 9876543211",
    dateOfBirth: "1980-03-22",
    role: "distributor",
    companyName: "AgriLink Distribution",
    businessAddress: "Sector 18, Noida, Uttar Pradesh",
    licenseNumber: "DL-2024-5678",
    distributionAreas: "Delhi NCR, Western UP",
    vehicleDetails: "10 Refrigerated Trucks, 5 Pickup Vans",
    registeredAt: "2024-02-01"
  },
  retailer: {
    firstName: "Priya",
    lastName: "Sharma",
    email: "retailer@gmail.com",
    phone: "+91 9876543212",
    dateOfBirth: "1990-09-10",
    role: "retailer",
    storeName: "Fresh Mart",
    storeAddress: "Main Market, Connaught Place, New Delhi",
    businessType: "Grocery Store",
    gstNumber: "07ABCDE1234F1Z5",
    registeredAt: "2024-02-15"
  },
  customer: {
    firstName: "Anita",
    lastName: "Verma",
    email: "customer@gmail.com",
    phone: "+91 9876543213",
    dateOfBirth: "1992-12-05",
    role: "customer",
    address: "B-101, Residential Complex, Gurgaon, Haryana",
    preferences: "Organic products, Local sourcing",
    registeredAt: "2024-03-01"
  }
};