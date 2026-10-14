import { type BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
    return (
        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STYLES[status] || STYLES.pending}`}>
            {status}
        </span>
    );
}
