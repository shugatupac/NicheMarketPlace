import React from "react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  reviewCount, 
  size = "md" 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };
  
  const textSizes = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm"
  };
  
  const renderStar = (type: "full" | "empty", index: number) => {
    return (
      <svg 
        key={`${type}-${index}`}
        xmlns="http://www.w3.org/2000/svg" 
        className={`${starSizes[size]} ${type === "full" ? "fill-primary" : "stroke-primary fill-none"}`}
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  };

  return (
    <div className="flex items-center">
      <div className="flex text-primary">
        {[...Array(fullStars)].map((_, i) => renderStar("full", i))}
        {hasHalfStar && (
          <svg 
            key="half-star"
            xmlns="http://www.w3.org/2000/svg" 
            className={starSizes[size]}
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="half-star-gradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#half-star-gradient)" 
              stroke="currentColor"
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => renderStar("empty", i))}
      </div>
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-neutral-500 ml-1`}>({reviewCount})</span>
      )}
    </div>
  );
};

export default StarRating;
