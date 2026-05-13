export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'maintenance' | 'accountant';
  profile_picture?: string;
}

export interface Room {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  roomTypeName?: string;
  basePrice?: number;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  idType?: string;
  idNumber?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface Booking {
  id: string;
  hotelId: string;
  guestId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  totalAmount: number;
  guestName?: string;
  guestPhone?: string;
  roomNumber?: string;
}

export interface DashboardStats {
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  availableRooms: number;
}

export interface BookingTrend {
  date: string;
  bookings: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}
