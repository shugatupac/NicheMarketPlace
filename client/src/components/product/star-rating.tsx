import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, size = "md" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "lg":
        return "h-5 w-5";
      case "md":
      default:
        return "h-4 w-4";
    }
  };
  
  const sizeClass = getSizeClass();
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          // Full star
          return (
            <Star
              key={i}
              className={`${sizeClass} fill-yellow-400 text-yellow-400 mr-0.5`}
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          // Half star
          return (
            <StarHalf
              key={i}
              className={`${sizeClass} fill-yellow-400 text-yellow-400 mr-0.5`}
            />
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              className={`${sizeClass} text-gray-300 mr-0.5`}
            />
          );
        }
      })}
    </div>
  );
}