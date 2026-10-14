export type Category = {
    id: string;
    name: string;
    slug: string;
};

export type Freelancer = {
    id: string;
    name: string;
    role: string; // matches Category.name
    bio?: string | null;
    rate: number;
    rate_unit?: string | null;
    availability: "Available" | "Busy" | "Offline" | string;
    location?: string | null;
    image_url?: string | null;
    skills?: string[] | null;
    created_at?: string;
};

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Booking = {
    id: string;
    freelancer_id: string | null;
    freelancer_name: string;
    category: string | null;
    client_name: string;
    client_phone: string;
    description: string | null;
    preferred_date: string | null;
    amount: number | null;
    status: BookingStatus;
    created_at: string;
};

export const BOOKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export function formatRate(rate: number, unit?: string | null) {
    return `₱${Number(rate).toLocaleString("en-PH")}${unit ? `/${unit}` : ""}`;
}
