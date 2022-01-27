// import react
import { useRef, useState } from 'react';

// import MUI components
import Box from '@mui/material/Box';

// import swiper
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import icons
import { CarouselNext, CarouselPrev } from '../../components/Icons/index';


const SwiperBtnNext = (props) => {
    const { isSm } = props;
    return {
        position: 'absolute',
        transform: 'translateX(10px)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

const SwiperBtnPrev = (props) => {
    const { isSm } = props
    return {
        position: 'absolute',
        left: 0,
        transform: 'translateX(-15px)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

export default function HomeCarousel(props) {

    const { isSm } = props;

    const [current, setCurrent] = useState(0);
    const navigationNewContentPrevRef = useRef(null);
    const navigationNewContentNextRef = useRef(null);

    const images = [
        {
            imgSrc: 'https://picsum.photos/1190/420?img=1',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=1',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=2',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=3',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=4',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=5',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=6',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        },
        {
            imgSrc: 'https://picsum.photos/1190/420?img=7',
            thumbnailSrc: 'https://picsum.photos/1190/420?img=2',
            alt: "image 1"
        }
    ]

    const handleChangeSlideClick = (isNext) => {
        let newCurrent = null;
        if (isNext) {
            newCurrent = current < (images.length - 1) ? current + 1 : current;
        }
        else {
            newCurrent = current > 0 ? current - 1 : current;
        }
        setCurrent(newCurrent);
    }

    const handleClickThumbnail = (e) => {
        const id = Number(e.currentTarget.id);
        setCurrent(id);
        e.stopPropagation();
    }

    return (
        <Box sx={{ height: isSm ? '280px' : '420px', position: 'relative', width: '100%' }}>
            <div style={{ height: '100%', width: '100%' }}>
                {images.map((image, idx) => (
                    <img
                        style={{
                            ...(idx !== current && { display: 'none' }),
                            objectFit: 'cover',
                            width: `100%`,
                            position: 'absolute',
                            height: '100%',
                            left: 0
                        }}
                        alt={image.alt}
                        key={idx}
                        src={image.imgSrc}
                    />
                ))}
            </div>
            <Box sx={{
                position: 'absolute',
                width: isSm ? '80%' : '30%',
                minWidth: isSm ? '288px' : '452px',
                bottom: 33,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                right: { sm: 48, xs: 0 }
            }}>
                <Swiper

                    navigation={{
                        prevEl: navigationNewContentPrevRef.current,
                        nextEl: navigationNewContentNextRef.current
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = navigationNewContentPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNewContentNextRef.current;
                    }}
                    slidesPerView={4}
                >
                    {images.map((image, idx) => (
                        <SwiperSlide
                            onClick={handleClickThumbnail}
                            id={idx}
                            key={idx}
                            style={{
                                flexShrink: 'unset'
                            }}
                        >
                            <img
                                style={{
                                    width: isSm ? 65 : 95,
                                    height: isSm ? 35 : 45,
                                    marginLeft: '16px',
                                    ...(idx === 0 && { marginLeft: 0 }),
                                    borderRadius: '6px',
                                    ...(idx === current && {
                                        border: '2px solid white'
                                    })
                                }}
                                alt={image.alt}
                                key={idx}
                                src={image.imgSrc} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div
                    onClick={() => { handleChangeSlideClick(false) }}
                    style={{
                        ...SwiperBtnPrev({ isSm })
                    }}
                    ref={navigationNewContentPrevRef}
                >
                    <CarouselPrev />
                </div>
                <div
                    onClick={() => { handleChangeSlideClick(true) }}
                    style={{
                        ...SwiperBtnNext({ isSm })
                    }}
                    ref={navigationNewContentNextRef}
                >
                    <CarouselNext />
                </div>
            </Box>
        </Box>
    )
}