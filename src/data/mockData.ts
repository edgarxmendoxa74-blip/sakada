export type Category = {
    id: string;
    name: string;
    slug: string;
    iconName: string; // We'll map this to Lucide icons
    description?: string;
};

export type Freelancer = {
    id: string;
    categoryId: string;
    name: string;
    role: string;
    bio: string;
    rate: number;
    rateUnit: "hour" | "service";
    rating: number; // 0-5
    reviewCount: number;
    imageUrl: string;
    location: string;
    availability: "Available" | "Busy" | "Offline";
    skills: string[];
};

export const categories: Category[] = [
    {
        id: "1",
        name: "Hotel Services",
        slug: "hotel-services",
        iconName: "Hotel",
        description: "Housekeeping, Front Desk, Concierge",
    },
    {
        id: "2",
        name: "Restaurant Services",
        slug: "restaurant-services",
        iconName: "Utensils",
        description: "Chefs, Waitstaff, Dishwashing",
    },
    {
        id: "3",
        name: "Health, Wellness & Beauty",
        slug: "health-wellness",
        iconName: "HeartHandshake",
        description: "Massage, Nursing, Cosmetics",
    },
    {
        id: "4",
        name: "Transportation / Delivery",
        slug: "transportation",
        iconName: "Truck",
        description: "Drivers, Movers, Delivery Riders",
    },
    {
        id: "5",
        name: "Maintenance Services",
        slug: "maintenance",
        iconName: "Wrench",
        description: "Plumbing, Electrical, HVAC",
    },
    {
        id: "6",
        name: "Building / House Services",
        slug: "building-house",
        iconName: "Home",
        description: "Cleaning, Painting, Carpentry",
    },
    {
        id: "7",
        name: "Tutorial Services",
        slug: "tutorial",
        iconName: "BookOpen",
        description: "Academic Tutors, Language Instructors",
    },
    {
        id: "8",
        name: "Legal & Documentation",
        slug: "legal",
        iconName: "FileText",
        description: "Notary, Paralegal, Document Processing",
    },
];

export const freelancers: Freelancer[] = [
    {
        id: "f1",
        categoryId: "3",
        name: "Sarah G.",
        role: "Professional Massage Therapist",
        bio: "Certified therapist with 5 years of experience in Swedish and Shiatsu massage.",
        rate: 500,
        rateUnit: "hour",
        rating: 4.8,
        reviewCount: 32,
        imageUrl: "/api/placeholder/400/400", // We will deal with images later
        location: "Makati City",
        availability: "Available",
        skills: ["Swedish Massage", "Shiatsu", "Reflexology"],
    },
    {
        id: "f2",
        categoryId: "5",
        name: "Mario Cruz",
        role: "Master Plumber",
        bio: "Licensed plumber specializing in residential leak repairs and pipe installation.",
        rate: 800,
        rateUnit: "service",
        rating: 4.9,
        reviewCount: 15,
        imageUrl: "/api/placeholder/400/400",
        location: "Quezon City",
        availability: "Available",
        skills: ["Leak Repair", "Pipe Installation", "Fixture Replacement"],
    },
    {
        id: "f3",
        categoryId: "7",
        name: "Teacher Anna",
        role: "Math Tutor",
        bio: "University graduate offering math tutoring for elementary and high school students.",
        rate: 350,
        rateUnit: "hour",
        rating: 5.0,
        reviewCount: 10,
        imageUrl: "/api/placeholder/400/400",
        location: "Manila",
        availability: "Busy",
        skills: ["Algebra", "Geometry", "Calculus Basics"],
    },
];
