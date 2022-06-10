// import react
import { useState, useEffect } from 'react';

// import MUI components
import {
    Box
} from '@mui/material';

// import swipper
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

// import utils
import useWindowSize from '../../utils/useWindowSize';
import { COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle'

// import services
import API from '../../services/api';

SwiperCore.use([Autoplay, Pagination]);

const CustomPaginationBullet = ({ numOfBullets, isSm, activePaginationBullet, handleClickPaginationBullet }) => {
    const ids = Array.from(Array(numOfBullets).keys());
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: isSm ? '-20px' : '-35px',
                right: '50%',
                transform: 'translateX(50%)',
                ...flexStyle('center', 'center'),
                columnGap: '16px',
            }}
        >
            {
                ids.map(idx => (
                    <Box
                        key={idx}
                        onClick={handleClickPaginationBullet}
                        id={idx}
                        sx={{
                            width: '6px',
                            height: '6px',
                            bgcolor: COLORS.blackStroker,
                            ...(activePaginationBullet === idx && {
                                border: `4.5px solid ${COLORS.main}`,
                                width: '3px',
                                height: '3px',
                                bgcolor: COLORS.white
                            }),
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    ></Box>
                ))
            }
        </Box>
    )
}

const NUM_BULLTES = 5;

export default function DiscoverySlider() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [imagesList, setImages] = useState([]);
    const [activePublisherPagination, setActivePublisherPagination] = useState(0);
    const [slicesInBullets, setSlicesInBullets] = useState({});

    useEffect(() => {
        async function fetchBannerImages() {
            const res = await api.getBannerImages();
            const data = await res.data.data;
            const images = data.map(i => i.image);
            setImages([...images]);
        }

        fetchBannerImages();
    }, []);

    useEffect(() => {
        calcSlicesPerBullet();
    }, [imagesList]);

    const swiperPagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return `<span id="discovery-pagination-${index}" class="${className}" style="visibility:hidden">${index + 1}</span>`;
        },
    };

    const handleClickPublisherPaginationBullet = (e) => {
        const id = Number(e.target.id);
        const maxImgInBullets = Math.max(...slicesInBullets[id]);
        const bulletId = `#discovery-pagination-${maxImgInBullets}`;
        const actualPaginationBullet = document.querySelector(bulletId);
        actualPaginationBullet.click();
        setActivePublisherPagination(id);
    }

    const handleSlideChange = (e) => {
        const realIndex = e.realIndex;
        for (let i in slicesInBullets) {
            if (slicesInBullets[i].includes(realIndex)) {
                setActivePublisherPagination(Number(i));
                return;
            }
        }
    }

    const calcSlicesPerBullet = () => {
        const imgInBullets = {
            0: [0]
        }
        const slicesPerGroup = Math.floor((imagesList.length - 1) / (NUM_BULLTES - 1));
        for (let i = 1; i <= 4; i++) {
            const startIdx = i * slicesPerGroup;
            const remainedImgs = imagesList.length - startIdx;
            if (i === 4) {
                imgInBullets[i] = Array.from({ length: remainedImgs }, (_, k) => k + startIdx);
                continue;
            }
            imgInBullets[i] = Array.from({ length: slicesPerGroup }, (_, k) => k + startIdx);
        }
        setSlicesInBullets({ ...imgInBullets });
    }

    return (
        <Box
            sx={{
                position: 'relative'
            }}
        >
            <CustomPaginationBullet
                numOfBullets={NUM_BULLTES}
                isSm={isSm}
                activePaginationBullet={activePublisherPagination}
                handleClickPaginationBullet={handleClickPublisherPaginationBullet}
            />
            <Swiper
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
                onSlideChange={handleSlideChange}
                slidesPerView={isSm ? 1 : 1.3}
                spaceBetween={32}
                pagination={swiperPagination}
                slidesPerGroup={slicesInBullets[activePublisherPagination]?.length || 1}
                style={{
                    margin: isSm ? '16px' : '32px 48px',
                    paddingTop: '32px'
                }}>
                {imagesList.map((item, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            style={{
                                width: '100%',
                                height: isSm ? '200px' : '322px',
                                borderRadius: isSm ? '16px' : '30px'
                            }}
                            src={item?.original_url}
                            alt={`images ${idx}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}