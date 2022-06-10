import SwiperCore, { Navigation } from 'swiper';

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
import { TEXT_STYLE, COLORS } from '../../utils/constants';
import formatPrice from '../../utils/formatPrice';

SwiperCore.use([Navigation]);

export default function VipComboItem(props) {
    const { src, name, description, price, isSm, isPurchased } = props;
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
                            ...((isSm && !isPurchased) ? TEXT_STYLE.caption10Bold : TEXT_STYLE.title1),
                            ...(isPurchased && TEXT_STYLE.h3),
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

                {
                    !isPurchased && (
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
                    )
                }
            </CardContent>
            {
                !isPurchased && (
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
                )
            }
        </Card>
    )
} 