import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const StarRating = ({ rating, max = 5, onRatingChange, size = 5, interactive = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {[...Array(max)].map((_, i) => {
                const value = i + 1;
                const active = (hover || rating) >= value;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        className={cn(
                            "transition-all duration-200 focus:outline-none",
                            interactive ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"
                        )}
                        onClick={() => onRatingChange?.(value)}
                        onMouseEnter={() => interactive && setHover(value)}
                        onMouseLeave={() => interactive && setHover(0)}
                    >
                        <Star
                            className={cn(
                                `w-${size} h-${size}`,
                                active ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-transparent"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
