/**
 * Add real quotes from managers, mentors or teammates here (with their
 * permission). The Testimonials carousel appears automatically once this list
 * has at least one entry, and stays hidden while it's empty. Never ship
 * invented quotes: recruiters check.
 *
 * Example:
 * {
 *   quote: "Kevin took the patent pipeline from idea to a working demo in four weeks.",
 *   name: "Dr. A. Mentor",
 *   role: "Faculty mentor, KIDS, Karunya",
 * },
 */
export type Testimonial = { quote: string; name: string; role: string };

export const testimonials: Testimonial[] = [];
