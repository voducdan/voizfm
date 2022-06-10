// import react
import { useState, useEffect } from 'react';

import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

// import MUI components
import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    CardActions
} from '@mui/material';

// import others components
import VipComboItem from '../Shared/VipComboItem';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatPrice from '../../utils/formatPrice';

// import service
import API from '../../services/api';

SwiperCore.use([Navigation]);

export default function VipCombo() {
    const windowSize = useWindowSize();
    const [combo, setCombo] = useState([])
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    useEffect(() => {
        const api = new API()
        async function fetchCombo() {
            const res = await api.getComboPackage();
            const data = await res.data.data;
            setCombo(data);
        }

        fetchCombo();
    }, []);

    return (
        <Box
            sx={{
                padding: isSm ? '32px 0' : '80px 47px'
            }}
        >
            <Box>
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white,
                        textAlign: 'center',
                        mb: isSm ? '17px' : '49px'
                    }}
                >
                    Các gói combo
                </Typography>
            </Box>
            <Swiper slidesPerView={isSm ? 2.5 : 4} spaceBetween={isSm ? 6 : 28} >
                {combo.map((item) => (
                    <SwiperSlide
                        key={item.id}>
                        <VipComboItem
                            isPurchased={false}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            src={item.avatar.thumb_url}
                            isSm={isSm}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Typography
                sx={{
                    ...TEXT_STYLE.content1,
                    color: COLORS.bg4,
                    textAlign: 'center',
                    mt: '40px'
                }}
            >Restore</Typography>
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    mt: '56px'
                }}
            >
                <Button
                    sx={{
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                        textTransform: 'none',
                        bgcolor: COLORS.main,
                        height: '48px',
                        width: isSm ? '90%' : '40%',
                        margin: '0 auto'
                    }}
                >
                    Bạn muốn mua riêng từng quyển sách
                </Button>
            </Box>
        </Box>
    )
}