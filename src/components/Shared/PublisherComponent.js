// import react
import { useRef, useState } from 'react';

// import MUI components
import {
    Typography,
    Box
} from '@mui/material';

// import swiper
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import others components
import Thumbnail from '../../components/Thumbnail/Thumbnail';

// import icons
import { RightArrow, CarouselPrev, CarouselNext } from '../../components/Icons/index';

// import utils
import { TEXT_STYLE, FONT_FAMILY, COLORS } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle'

SwiperCore.use([Navigation, Pagination]);

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

const CustomPaginationBullet = ({ numOfBullets, activePaginationBullet, handleClickPaginationBullet }) => {
    const ids = Array.from(Array(numOfBullets).keys());
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '32px',
                right: '48px',
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
                            width: '14px',
                            height: '14px',
                            bgcolor: activePaginationBullet === idx ? COLORS.second : COLORS.placeHolder,
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                    ></Box>
                ))
            }
        </Box>
    )
}

export default function PublisherComponent(props) {
    const { isSm } = props;
    const publishers = [
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/1.png', id: 1 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/2.png', id: 2 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/3.png', id: 3 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/4.png', id: 4 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/5.png', id: 5 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/6.png', id: 6 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/7.png', id: 7 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/8.png', id: 8 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/9.png', id: 9 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/10.png', id: 10 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/11.png', id: 11 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/12.png', id: 12 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/13.png', id: 13 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/14.png', id: 14 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/15.png', id: 15 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/16.png', id: 16 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/17.png', id: 17 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/18.png', id: 18 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/19.png', id: 19 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/20.png', id: 20 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/21.png', id: 21 },
        { url: 'https://voiz-nxb.s3.cloud.cmctelecom.vn/22.png', id: 22 }
    ];
    const num_items_per_line = !isSm ? 5 : 2.5;

    const [activePublisherPagination, setActivePublisherPagination] = useState(0);
    const [showNavigationBtn, setShowNavigationBtn] = useState(false);

    const navigationPublisherPrevRef = useRef(null);
    const navigationPublisherNextRef = useRef(null);

    const swiperPagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return `<span id="publisher-pagination-${index}" class="${className}" style="visibility:hidden">${index + 2}</span>`;
        },
    };

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
            cursor: 'pointer',
            ...((isSm || !showNavigationBtn) && { display: 'none' })
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
            cursor: 'pointer',
            ...((isSm || !showNavigationBtn) && { display: 'none' })
        }
    }

    const handleClickPublisherPaginationBullet = (e) => {
        const id = Number(e.target.id);
        const actualPaginationBullet = document.querySelector(`#publisher-pagination-${id}`);
        actualPaginationBullet.click();
        setActivePublisherPagination(id);
    }

    const handleSlideChange = (e) => {
        const realIndex = e.realIndex;
        const id = Math.ceil(realIndex / 5);
        setActivePublisherPagination(id);
    }

    return (
        <Box
            onMouseOver={() => { setShowNavigationBtn(true); }}
            onMouseOut={() => { setShowNavigationBtn(false); }}
            sx={{
                padding: isSm ? '32px 15px 23px 15px' : '32px 48px 23px 48px',
                backgroundColor: COLORS.bg2,
                position: 'relative'
            }}>
            <CustomPaginationBullet
                numOfBullets={5}
                activePaginationBullet={activePublisherPagination}
                handleClickPaginationBullet={handleClickPublisherPaginationBullet}
            />
            {<Title content="Nhà xuất bản" isSm={isSm} />}
            <Swiper
                onSlideChange={handleSlideChange}

                pagination={swiperPagination}

                navigation={{
                    prevEl: navigationPublisherPrevRef.current,
                    nextEl: navigationPublisherNextRef.current
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPublisherPrevRef.current;
                    swiper.params.navigation.nextEl = navigationPublisherNextRef.current;
                }}
                slidesPerGroup={5}
                slidesPerView={num_items_per_line}
                spaceBetween={isSm ? 8 : 20}>
                {publishers.map((item) => (
                    <SwiperSlide key={item.id}>
                        <a>
                            <Thumbnail style={{ borderRadius: '6px', width: '100%', height: isSm ? '81px' : '112px' }} avtSrc={item.url} alt={`images ${item.id}`} ></Thumbnail>
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