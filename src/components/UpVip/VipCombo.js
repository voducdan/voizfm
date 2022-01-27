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

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatPrice from '../../utils/formatPrice';

// import service
import API from '../../services/api';

SwiperCore.use([Navigation]);


const VipComboItem = (props) => {
    const { src, name, description, price, isSm } = props;
    return (
        <Card
            sx={{
                bgcolor: COLORS.bg2
            }}
        >
            <Box
                sx={{
                    position: 'relative'
                }}
            >
                <CardMedia
                    component="img"
                    alt={`${name} img`}
                    image={src}
                    height={isSm ? '147px' : '253'}
                />
                <Box
                    sx={{
                        height: isSm ? '24px' : '41px',
                        width: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        position: 'absolute',
                        bottom: 0,
                        margin: 'auto',
                        ...flexStyle('center', 'center')
                    }}
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.caption10Bold : TEXT_STYLE.title1),
                            textTransform: 'uppercase',
                            color: COLORS.white,
                            textAlign: 'center'
                        }}
                    >{name}</Typography>
                </Box>

            </Box>
            <CardContent>
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.VZ_Caption_2 : TEXT_STYLE.content1),
                        color: COLORS.contentIcon,
                        display: '-webkit-box',
                        mb: '8px',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {description}
                </Typography>

                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                    }}
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.VZ_Caption_2 : TEXT_STYLE.content1),
                            color: COLORS.VZ_Text_content,
                            mr: '5px'
                        }}
                    >
                        Giá:
                    </Typography>
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.VZ_Caption_2 : TEXT_STYLE.h3),
                            color: COLORS.white,
                            wordBreak: 'break-all'
                        }}
                    >
                        {formatPrice(price)}đ/tháng
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    sx={{
                        ...(isSm ? TEXT_STYLE.VZ_Caption_2 : TEXT_STYLE.title4),
                        color: COLORS.white,
                        textTransform: 'none',
                        bgcolor: COLORS.main,
                        height: '41px',
                        width: '70%',
                        margin: isSm ? '0 auto 16px auto' : '0 auto 24px auto'
                    }}
                >Mua</Button>
            </CardActions>
        </Card>
    )
}

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