// import react
import { useEffect, useState } from 'react';

// import next link
import Link from 'next/link';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

// import MUI components
import {
    Typography,
    Box,
    Button,
    Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import others components
import Thumbnail from '../Thumbnail/Thumbnail';

// import utils
import { SCREEN_BREAKPOINTS, TEXT_STYLE, COLORS, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { flexStyle } from '../../utils/flexStyle'

// import service
import API from '../../services/api';

const Title = (props) => {
    const { id, avatar, isSm, content, haveArrow } = props
    return (
        <Link
            href={`/channels/${id}`}
            style={{ textDecoration: 'none' }}
        >
            < Box sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: isSm ? '10px' : '20px'
            }}>
                <Avatar
                    sx={{
                        width: isSm ? '39px' : '46px',
                        height: isSm ? '39px' : '46px',
                    }} alt={`image ${content}`} src={avatar}
                />
                <Typography sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white
                }}>
                    {content}
                </Typography>
                {
                    haveArrow && (
                        <ArrowForwardIosIcon fontSize={isSm ? 'small' : 'medium'} sx={{ color: COLORS.white }} />
                    )
                }

            </ Box >
        </Link>
    )
}

SwiperCore.use([Navigation]);

export default function Channel() {

    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const SPACE_BETWEEN = isSm ? 16 : 24;
    const NUMBER_ITEMS_PER_LINE = isSm ? 2.5 : 5;
    const SIDE_PADDING = isSm ? 19 : 48;
    const numItemsPerLine = isSm ? 2.5 : 5;
    const [recommandedChannels, setRecommandedChannels] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchRecommandedChannels() {
            const res = await api.getRecommendedChannels(page);
            const newChannels = await res.data.data;
            const data = [...recommandedChannels, ...newChannels]
            setRecommandedChannels(data);
        }

        fetchRecommandedChannels();
    }, [page]);

    const getPlaylistImgWidth = () => {
        const width = windowSize.width;
        let innerWidth = width - SIDE_PADDING * 2;
        const spaceToBeSubstracted = ((NUMBER_ITEMS_PER_LINE - 1) * SPACE_BETWEEN) / NUMBER_ITEMS_PER_LINE;
        if (!isSm) {
            innerWidth -= DRAWER_WIDTH;
        }
        return (innerWidth / NUMBER_ITEMS_PER_LINE) - spaceToBeSubstracted;
    }

    const handleLoadMoreChannel = () => {
        const newPage = page + 1;
        setPage(newPage);
    }

    const handleBookmark = (is_bookmark, channelId) => {
        async function bookmarkChannel(channelId) {
            const res = await api.bookmarkChannel(channelId);
            const data = await res.data.data;
        }

        bookmarkChannel(channelId);
        const channelToBookmarkIdx = recommandedChannels.findIndex(i => i.id === channelId);
        const updatedRecommandedChannels = [...recommandedChannels];
        updatedRecommandedChannels[channelToBookmarkIdx]['is_bookmark'] = !is_bookmark;
        setRecommandedChannels([...updatedRecommandedChannels]);
    }

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '20vh',
                    ...flexStyle('center', 'center'),
                    background: '#222530',
                    position: 'relative',
                    '&::before': {
                        content: "''",
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: "url('/images/bgchannel.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        opacity: 0.4
                    }
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '72px',
                        color: COLORS.white
                    }}
                >Kênh nổi bật</Typography>
            </Box>
            <Box
                sx={{
                    p: `0 ${SIDE_PADDING}px`,
                    mt: '56px'
                }}
            >
                {
                    recommandedChannels.map(i => (
                        <Box key={i?.id}>
                            <Box
                                sx={{
                                    ...flexStyle('space-between', 'center'),
                                    mb: '24px'
                                }}
                            >
                                <Title id={i?.id} avatar={i?.avatar?.thumb_url} content={i?.name} isSm={isSm} haveArrow={true} />
                                <Button
                                    onClick={() => { handleBookmark(i.is_bookmark, i.id) }}
                                    sx={{
                                        ...TEXT_STYLE.title1,
                                        color: COLORS.white,
                                        borderRadius: '22px',
                                        height: isSm ? '28px' : '48px',
                                        textTransform: 'none',
                                        bgcolor: i?.is_bookmark ? COLORS.bg3 : COLORS.main,
                                        pl: '14px',
                                        pr: '14px',
                                        ':hover': {
                                            bgcolor: i?.is_bookmark ? COLORS.bg3 : COLORS.main
                                        }
                                    }}
                                    startIcon={i?.is_bookmark ? <CheckIcon /> : <AddIcon />}
                                >{i?.is_bookmark ? 'Hủy theo dõi' : 'Theo dõi'}</Button>
                            </Box>
                            <Swiper
                                slidesPerView={numItemsPerLine}
                                spaceBetween={isSm ? 8 : 24}
                                style={{
                                    marginBottom: isSm ? 35 : 56
                                }}
                            >
                                {i?.playlists.map(item => (
                                    <SwiperSlide
                                        key={item?.id}
                                        style={{
                                            height: `${getPlaylistImgWidth()}px`
                                        }}
                                    >
                                        <Link
                                            href={`/play/${item?.id}`}
                                        >
                                            <a>
                                                <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item?.name}`} ></Thumbnail>
                                            </a>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Box>
                    ))
                }
                <Box
                    sx={{
                        mt: '26px',
                        mb: '80px',
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            color: COLORS.white,
                            ...TEXT_STYLE.title1,
                            borderRadius: '8px',
                            height: '48px',
                            width: '142px',
                            border: `1px solid ${COLORS.blackStroker}`
                        }}
                        onClick={handleLoadMoreChannel}
                    >
                        Xem thêm
                    </Button>
                </Box>
            </Box>
        </Box >
    )
}