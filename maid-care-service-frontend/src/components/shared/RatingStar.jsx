import React, { useState, useMemo } from 'react';
import { HStack, Text } from '@chakra-ui/react';

// Note for RatingStar component
// - PutRatingStar using for post/put a rating when user review their jobs. 
//      use case example : use PutRatingStar in  review form in order to let user give rating for a maid who responsible for their jobs
// - GetRatingStar using for get rating information.
//      use case example : use GetRatingStar in maidInfo component in order to get maid rating.


export const PutRatingStar = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const onMouseEnter = (index) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };
  const onSaveRating = (index) => {
    setRating(index);
  };
  return (
    <HStack width={230} alignItems="center">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <PutRatingIcon
            key={index}
            index={index}
            rating={rating}
            hoverRating={hoverRating}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onSaveRating={onSaveRating}
          />
        );
      })}
      <Text>{rating} / 5 stars</Text>
    </HStack>
  );
};

export const GetRatingStar = ({ rating }) => {
  const [hoverRating, setHoverRating] = useState(rating);
  return (
    <HStack width={230} alignItems="center">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <GetRatingIcon key={index} index={index} rating={rating} hoverRating={hoverRating} />
        );
      })}
      <Text>{rating} / 5 stars</Text>
    </HStack>
  );
};

// PutRatingIcon is a function that return each star icon that can be interact ( click on the icon to give rating ) 
const PutRatingIcon = (props) => {
  const { index, rating, hoverRating, onMouseEnter, onMouseLeave, onSaveRating } = props;
  const fill = useMemo(() => {
    if (hoverRating >= index) {
      return 'yellow';
    } else if (!hoverRating && rating >= index) {
      return 'yellow';
    }
    return 'none';
  }, [rating, hoverRating, index]);
  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onSaveRating(index)}>
      <StarIcon fill={fill} />
    </div>
  );
};


// GetRatingIcon is a function that return each star icon that can not be interact ( can not click on the icon to give rating ) 
const GetRatingIcon = (props) => {
  const { index, rating, hoverRating } = props;
  const fill = useMemo(() => {
    if (hoverRating >= index) {
      return 'yellow';
    } else if (!hoverRating && rating >= index) {
      return 'yellow';
    }
    return 'none';
  }, [rating, hoverRating, index]);
  return (
    <div>
      <StarIcon fill={fill} />
    </div>
  );
};

// StarIcon return star icon.
const StarIcon = (props) => {
  const { fill = 'none' } = props;
  return (
    <svg
      width="20px"
      fill={fill}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
    </svg>
  );
};
