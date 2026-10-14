import {
    Hotel, Utensils, HeartHandshake, Truck, Wrench, Home, BookOpen, FileText, Briefcase,
    type LucideIcon,
} from "lucide-react";

const ICON_RULES: [RegExp, LucideIcon][] = [
    [/hotel|lodg|resort/i, Hotel],
    [/restaurant|food|cook|chef|kitchen/i, Utensils],
    [/health|wellness|beauty|massage|salon|spa/i, HeartHandshake],
    [/transport|deliver|driver|move/i, Truck],
    [/maint|repair|plumb|electric|aircon|hvac/i, Wrench],
    [/build|house|home|clean|paint|carpent/i, Home],
    [/tutor|teach|school|lesson/i, BookOpen],
    [/legal|document|notary|permit/i, FileText],
];

export function getCategoryIcon(name: string): LucideIcon {
    return ICON_RULES.find(([re]) => re.test(name))?.[1] ?? Briefcase;
}
