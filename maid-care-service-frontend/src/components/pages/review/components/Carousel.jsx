import Carousel, { Dots, slidesToShowPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { useState } from 'react';
import { Image, Box } from '@chakra-ui/react';

const CarouselWithDots = ({ job }) => {
  const { photos } = job;
  const [value, setValue] = useState(0);

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <>
      <Carousel
      offset={1}
      itemWidth={350}
        plugins={[
          'clickToChange',
          'centered',
          {
            resolve: slidesToShowPlugin,
            options: {
              numberOfSlides: 2,
            },
          },
        ]}>
        {photos && photos.map((photo) => <Box h="17rem" ><Image h="100%" w="100%" objectFit="cover" src={photo} /></Box>)}
      </Carousel>
    </>
  );
};

export default CarouselWithDots;
