import { getSetting } from "@/db/queries/settings-queries";
import { ReviewsCarousel, type ReviewItem } from "./reviews-carousel";

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: "Alex M",
    date: "2023-11-20",
    title: "Excellence",
    body: "Meetup works with the best freelance guides that we can find. Each guide specializes in a specific niche. From the northern mountains to the southern coast, every trip is carefully crafted to deliver an authentic Vietnamese experience.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 2,
    name: "Sarah K",
    date: "2023-12-05",
    title: "Amazing trip!",
    body: "Great experience, highly recommend! The team was incredibly helpful and made our trip unforgettable.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 3,
    name: "John D",
    date: "2024-01-15",
    title: "Unforgettable",
    body: "The tour was beyond our expectations. Our guide was incredibly knowledgeable about Vietnamese history and culture. The food stops were authentic and delicious. We visited hidden gems that we would never have found on our own.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 4,
    name: "Maria L",
    date: "2024-02-10",
    title: "Perfect service",
    body: "Well organized, friendly staff. Highly recommend to anyone wanting to experience the real Vietnam.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
  {
    id: 5,
    name: "Tom H",
    date: "2024-03-01",
    title: "Best tour ever",
    body: "Meetup works with the best freelance guides that we can find. From the breathtaking Ha Giang loop to the serene Mekong Delta, this company delivers exceptional adventures every single time.",
    photo: "/images/review-photo.jpg",
    avatar: "/images/review-avatar.jpg",
  },
];

/**
 * ReviewsSection — server component.
 * Loads reviews from CMS (siteSettings key "homepage_reviews").
 * Falls back to FALLBACK_REVIEWS when DB unavailable or setting not set.
 */
export async function ReviewsSection() {
  let reviews = FALLBACK_REVIEWS;
  try {
    const data = await getSetting<ReviewItem[]>("homepage_reviews");
    if (Array.isArray(data) && data.length > 0) reviews = data;
  } catch {
    // DB unavailable — use fallback
  }
  return <ReviewsCarousel reviews={reviews} />;
}
