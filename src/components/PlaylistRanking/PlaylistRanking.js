// import react
import { useEffect, useState } from 'react';

// import next link
import Link from 'next/link';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import MUI component
import {
    Box,
    Typography,
    Chip
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import StarIcon from '@mui/icons-material/Star';

// import icons
import {
    AudioBook
} from '../Icons/index'


// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

SwiperCore.use([Navigation]);

const Tab = (props) => {
    const { id, text, tab, onClick, isSm, idx } = props;
    const iconProps = id === tab ? {
        bgfill: 'none',
        fill: '#50D0EC',
        stroke: COLORS.white
    } : {
        bgfill: 'none',
        fill: COLORS.bg3,
        stroke: COLORS.white
    }
    return (
        <Box
            id={id}
            onClick={onClick}
            sx={{
                ...flexStyle('flex-start', 'center'),
                width: 'max-content',
                height: '100%',
                mr: (idx === tabItems.length - 1) ? 0 : '5%',
                columnGap: '16px',
                cursor: 'pointer'
            }}
        >
            <Box
                sx={{
                    ...flexStyle('center', 'center')
                }}
            >
                <AudioBook {...iconProps} />
            </Box>
            <Typography
                sx={{
                    ...TEXT_STYLE.h3,
                    color: (id === tab) ? COLORS.white : COLORS.contentIcon
                }}
            >
                {text}
            </Typography>
        </Box>
    )
}

const tabItems = [
    {
        id: 'audio_book',
        text: 'Sách nói'
    },
    {
        id: 'story_book',
        text: 'Truyện nói'
    },
    {
        id: 'podcast',
        text: 'Podcast'
    },
    {
        id: 'summary_book',
        text: 'Sách tóm tắt'
    },
    {
        id: 'children_book',
        text: 'Thiếu nhi'
    }
]

const rankingType = [
    {
        id: 'week',
        name: 'Tuần'
    },
    {
        id: 'month',
        name: 'Tháng'
    },
    {
        id: 'year',
        name: 'Năm'
    }
]

export default function PlaylistRanking() {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [playlists, setPlaylists] = useState([]);
    const [tab, setTab] = useState('audio_book');
    const [type, setType] = useState('week');

    useEffect(() => {
        async function fetchPlaylistRanking() {
            const res = await api.getPlaylistRanking(type, tab);
            const data = res.data.data;
            setPlaylists(data);
        }

        fetchPlaylistRanking();
    }, [tab, type]);

    const handleTabClick = (e) => {
        const id = e.currentTarget.id;
        setTab(id)
        e.stopPropagation();
    };

    const handleClickType = (e) => {
        const id = e.currentTarget.id;
        setType(id)
        e.stopPropagation();
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
                    height: '30vh',
                    mixBlendMode: 'normal',
                    bgcolor: 'black',
                    ...flexStyle('center', 'center'),
                    position: 'relative'
                }}
            >
                <img
                    src='/images/ranking_bg.png'
                    style={{
                        opacity: .25,
                        position: 'absolute',
                        zIndex: 1,
                        width: '100%',
                        height: '100%'
                    }}
                />
                <Typography
                    sx={{
                        fontFamily: 'Work Sans',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '48px',
                        lineHeight: '72px',
                        color: COLORS.white,
                        zIndex: 2
                    }}
                >
                    Bảng xếp hạng
                </Typography>
            </Box>
            {
                !isSm && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '80px',
                            bgcolor: COLORS.bg2,
                            ...flexStyle('center', 'center'),
                            boxSizing: 'border-box'
                        }}
                    >
                        {
                            tabItems.map((i, idx) => (
                                <Tab
                                    onClick={handleTabClick}
                                    isSm={isSm}
                                    tab={tab}
                                    id={i.id}
                                    key={i.id}
                                    idx={idx}
                                    text={i.text} />
                            ))

                        }
                    </Box>
                )
            }
            {
                isSm && (
                    <Swiper
                        slidesPerView='auto'
                        spaceBetween={32}
                        style={{
                            height: '80px',
                            backgroundColor: COLORS.bg2,
                            padding: '0 16px'
                        }}
                    >
                        {
                            tabItems.map(i => (
                                <SwiperSlide key={i?.id} style={{ width: 'auto' }}>
                                    <Tab
                                        onClick={handleTabClick}
                                        isSm={isSm}
                                        tab={tab}
                                        id={i.id}
                                        key={i.id}
                                        text={i.text} />
                                </SwiperSlide>
                            ))

                        }
                    </Swiper>
                )
            }
            <Box
                sx={{
                    width: '100%',
                    ...flexStyle('center', 'flex-start')
                }}
            >
                <Box
                    sx={{
                        mt: isSm ? '32px' : '36px',
                        width: isSm ? '90%' : '40%',
                        ...(!isSm && { minWidth: '560px' })
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '32px',
                            borderBottom: `1px solid ${COLORS.bg2}`,
                            pb: '16px',
                            boxSizing: 'border-box'
                        }}
                    >
                        {
                            rankingType.map(i => (
                                <Chip
                                    id={i.id}
                                    key={i.id}
                                    label={i.name}
                                    sx={{
                                        bgcolor: (i.id === type) ? COLORS.bg3 : 'transparent',
                                        color: COLORS.white,
                                        ...TEXT_STYLE.title1,
                                        ':hover': {
                                            bgcolor: COLORS.bg3
                                        }
                                    }}
                                    onClick={handleClickType}
                                />
                            ))
                        }

                    </Box>
                    {
                        playlists.map((i, idx) => (
                            <Box
                                key={i?.id}
                                sx={{
                                    width: '100%',
                                    height: isSm ? '96px' : '116px',
                                    ...flexStyle('flex-start', 'center'),
                                    columnGap: '22px',
                                    bgcolor: COLORS.bg2,
                                    mt: '40px',
                                    borderRadius: '6px'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '15%',
                                        height: '100%',
                                        bgcolor: COLORS.bg3,
                                        ...flexStyle('center', 'center'),
                                        borderTopLeftRadius: '6px',
                                        borderBottomLeftRadius: '6px',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                            color: COLORS.white
                                        }}
                                    >{(idx + 1) <= 9 ? `0${idx + 1}` : (idx + 1)}</Typography>
                                </Box>
                                <Link
                                    href={`/playlists/${i?.id}`}
                                    style={{ textDecoration: 'none', width: 'calc(85% - 22px)' }}
                                >
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: '24px',
                                            p: '8px 0',
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        <Box>
                                            <img
                                                src={i?.avatar?.thumb_url}
                                                alt={`image ${i?.name}`}
                                                style={{
                                                    width: isSm ? '80px' : '100px',
                                                    height: isSm ? '80px' : '100px'
                                                }}
                                            />
                                        </Box>
                                        <Box
                                        >
                                            <Typography
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                                    color: COLORS.white,
                                                    mb: '8px',
                                                    display: '-webkit-box',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >{i?.name}</Typography>
                                            <Box
                                                sx={{
                                                    ...flexStyle('flex-start', 'center'),
                                                    columnGap: '8px',
                                                    mb: isSm ? '4px' : '16px'
                                                }}
                                            >
                                                <AccountCircleOutlinedIcon sx={{
                                                    color: COLORS.contentIcon,
                                                    ...(isSm && {
                                                        width: '16px',
                                                        height: '16px'
                                                    })
                                                }} />
                                                <Typography
                                                    sx={{
                                                        ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                        color: COLORS.contentIcon
                                                    }}
                                                >{i?.author_string}</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    ...flexStyle('flex-start', 'center'),
                                                    columnGap: '8px'
                                                }}
                                            >
                                                <StarIcon sx={{
                                                    color: COLORS.second,
                                                    ...(isSm && {
                                                        width: '16px',
                                                        height: '16px'
                                                    })
                                                }} />
                                                <Typography
                                                    sx={{
                                                        ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                        color: COLORS.contentIcon
                                                    }}
                                                >{i?.playlist_counter?.content_avg} ({i?.playlist_counter?.ratings_count})</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Link>

                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box >
    )
}