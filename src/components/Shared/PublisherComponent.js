// import react
import { useRef } from 'react';

// import MUI components
import {
    Typography,
    Box
} from '@mui/material';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import others components
import Thumbnail from '../../components/Thumbnail/Thumbnail';

// import icons
import { RightArrow, CarouselPrev, CarouselNext } from '../../components/Icons/index';

// import utils
import { TEXT_STYLE, FONT_FAMILY, COLORS } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle'

SwiperCore.use([Navigation]);

const SwiperBtnNext = (props) => {
    const { isSm } = props;
    return {
        position: 'absolute',
        right: 0,
        width: '24px',
        height: '24px',
        top: '50%',
        transform: 'translate(-40px, 70%)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

const SwiperBtnPrev = (props) => {
    const { isSm } = props
    return {
        position: 'absolute',
        left: 0,
        width: '24px',
        height: '24px',
        top: '50%',
        transform: 'translate(28px, 70%)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

const Title = (props) => {
    const { isSm, content } = props;
    return (
        < Box sx={{
            ...flexStyle('flex-start', 'center'),
            marginBottom: '24px'
        }}>
            <Typography sx={{
                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                fontFamily: FONT_FAMILY,
                color: COLORS.white
            }}>
                {content}
            </Typography>
            <Box sx={{ marginLeft: '11.3px', marginTop: '6px' }}>
                <RightArrow fill={COLORS.white} />
            </Box>
        </ Box >
    )
}

export default function PublisherComponent(props) {
    const { isSm } = props;
    const newContent = [];
    const num_items_per_line = !isSm ? 5 : 2.5;

    const navigationPublisherPrevRef = useRef(null);
    const navigationPublisherNextRef = useRef(null);

    return (
        <Box
            sx={{
                padding: isSm ? '32px 15px 23px 15px' : '32px 48px 23px 48px',
                backgroundColor: COLORS.bg2,
                position: 'relative'
            }}>
            {<Title content="Nhà xuất bản" isSm={isSm} />}

            <Swiper
                navigation={{
                    prevEl: navigationPublisherPrevRef.current,
                    nextEl: navigationPublisherNextRef.current
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPublisherPrevRef.current;
                    swiper.params.navigation.nextEl = navigationPublisherNextRef.current;
                }}
                slidesPerView={num_items_per_line} spaceBetween={isSm ? 8 : 20}>
                {newContent.map((item) => (
                    <SwiperSlide key={item.id}>
                        <a>
                            <Thumbnail style={{ borderRadius: '6px', width: '100%', height: isSm ? '81px' : '112px' }} avtSrc={item.avtSrc} alt={`images ${item.id}`} ></Thumbnail>
                        </a>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div style={{
                ...SwiperBtnPrev({ isSm })
            }} ref={navigationPublisherPrevRef} ><CarouselPrev></CarouselPrev></div>
            <div style={{
                ...SwiperBtnNext({ isSm })
            }} ref={navigationPublisherNextRef} > <CarouselNext></CarouselNext></div>
        </Box>
    )
}