// import react
import { useRef, useState, useEffect } from 'react';

// import next link
import Link from 'next/link';

// import MUI components
import Box from '@mui/material/Box';

// import swiper
import SwiperCore, { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import icons
import { CarouselNext, CarouselPrev } from '../../components/Icons/index';

// import utils
import { SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import services
import API from '../../services/api';

SwiperCore.use([Autoplay, Navigation]);

export default function HomeCarousel() {

    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [current, setCurrent] = useState(0);
    const [images, setImages] = useState([]);
    const [showNavigationBtn, setShowNavigationBtn] = useState(false);
    const navigationBannerPrevRef = useRef(null);
    const navigationBannerNextRef = useRef(null);

    const SwiperBtnNext = (props) => {
        const { isSm } = props;
        return {
            position: 'absolute',
            transform: 'translate(-15px,-50%)',
            zIndex: 2,
            left: 0,
            top: '50%',
            cursor: 'pointer',
            display: 'block',
            ...((isSm || !showNavigationBtn) && { display: 'none' })
        }
    }

    const SwiperBtnPrev = (props) => {
        const { isSm } = props;
        return {
            position: 'absolute',
            right: 0,
            transform: 'translate(-10px, -50%)',
            zIndex: 2,
            top: '50%',
            cursor: 'pointer',
            display: 'block',
            ...((isSm || !showNavigationBtn) && { display: 'none' })
        }
    }

    useEffect(() => {
        async function fetchBannerImages() {
            const res = await api.getBannerImages();
            const data = await res.data.data;
            setImages([...data]);
        }

        fetchBannerImages();
    }, [])

    const handleChangeSliceClick = (isNext) => {
        let newCurrent = null;
        if (isNext) {
            newCurrent = current < (images.length - 1) ? current + 1 : current === images.length - 1 ? 0 : current;
        }
        else {
            newCurrent = current > 0 ? current - 1 : current === 0 ? images.length - 1 : current;
        }
        setCurrent(newCurrent);
    }

    const handleClickThumbnail = (e) => {
        const id = Number(e.currentTarget.id);
        setCurrent(id);
        e.stopPropagation();
    }

    const handleBannerSlideChange = (e) => {
        const realIndex = Number(e.realIndex);
        if (realIndex === images.length - 1) {
            setCurrent(0);
            return;
        }
        setCurrent(realIndex);
    }

    const parseDeepLink = (i) => {
        const bannerType = i.banner_type;
        const id = i.deep_link.split('=')[1]
        if (['playlist', 'channel', 'discovery', 'audio'].includes(bannerType)) {
            return `/${bannerType === 'discovery' ? 'discoverie' : bannerType}s/${id}`
        }
        if (bannerType === 'website') {
            return id;
        }

        if(bannerType === 'vip_user_action'){
            const discovery_id = id.split('&')[0];
            return `/discoveries/${discovery_id}`;
        }
        if(bannerType === 'free_user_action'){
            return '/up-vip'
        }
        return '';
    }

    return (
        <Box
            onMouseOver={() => { setShowNavigationBtn(true); }}
            onMouseOut={() => { setShowNavigationBtn(false); }}
            sx={{
                height: isSm ? '280px' : '420px',
                position: 'relative',
                width: '100%'
            }}
        >
            <div style={{ height: '100%', width: '100%' }}>
                {images.map((i, idx) => (
                    <a
                        href={parseDeepLink(i)}
                        target='_blank'
                        key={idx}
                    >
                        <img
                            style={{
                                ...(idx !== current && { display: 'none' }),
                                objectFit: 'fill',
                                width: '100%',
                                position: 'absolute',
                                height: '100%',
                                left: 0,
                                cursor: 'pointer'
                            }}
                            alt={i?.image?.id}
                            src={i?.image?.original_url}
                        />
                    </a>
                ))}
            </div>
            <Box
                sx={{
                    position: 'absolute',
                    width: isSm ? '288px' : '452px',
                    bottom: 33,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    right: { sm: 48, xs: 0 }
                }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <Swiper
                        loop={true}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false
                        }}
                        navigation={{
                            prevEl: navigationBannerPrevRef.current,
                            nextEl: navigationBannerNextRef.current
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = navigationBannerPrevRef.current;
                            swiper.params.navigation.nextEl = navigationBannerNextRef.current;
                        }}
                        onSlideChange={handleBannerSlideChange}
                        slidesPerView={4}
                    >
                        {images.map((i, idx) => (
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
                                        width: isSm ? '65px' : '95px',
                                        marginRight: '16px',
                                        height: isSm ? 35 : 45,
                                        ...(idx === 0 && { marginLeft: 0 }),
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        ...(idx === current && {
                                            border: '2px solid white',
                                        })
                                    }}
                                    alt={i?.image?.id}
                                    src={i?.image?.thumb_url} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div
                        id='next'
                        onClick={() => { handleChangeSliceClick(false) }}
                        style={{
                            ...SwiperBtnPrev({ isSm })
                        }}
                        ref={navigationBannerPrevRef}
                    >
                        <CarouselNext />
                    </div>
                    <div
                        id='prev'
                        onClick={() => { handleChangeSliceClick(true) }}
                        style={{
                            ...SwiperBtnNext({ isSm })
                        }}
                        ref={navigationBannerNextRef}
                    >
                        <CarouselPrev />
                    </div>
                </Box>
            </Box>
        </Box>
    )
}