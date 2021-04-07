import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import { useState } from 'react';

const CarouselWithDots = (job) => {
  const { photos } = job;
  const [value, setValue] = useState(0);

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <>
      <Carousel plugins={['arrows']}>
        {photos && photos.map((photo) => <img className="img-example" src={photo} />)}
      </Carousel>
    </>
  );
};

export default CarouselWithDots;
