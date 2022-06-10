
// import react
import { useState, useEffect, useRef } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

import { selectSearchStatus, selectPlaylistResults, handleCloseSearch } from '../../redux/OpenSearch';

// import next link
import Link from 'next/link';

// import swiper
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

// import MUI components
import {
    Typography,
    Box,
    Divider,
    Chip
} from '@mui/material';

// import others components
import Thumbnail from '../Thumbnail/Thumbnail';
import {
    AccessTime
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, DRAWER_WIDTH, SCREEN_BREAKPOINTS, HEADER_HEIGHT, HEADER_HEIGHT_MB } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import getRecentlyKeywork from '../../utils/getRecentlyKeywordsFromLocal';

// import service
import API from '../../services/api';

function useOutsideAlerter(ref) {
    const dispatch = useDispatch();
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && event.target.id !== 'input-search') {
                dispatch(handleCloseSearch());
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default function Search() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    const [commonKeywords, setCommonKeywords] = useState([]);
    const [recentlyKeywords, setRecentlyKeywords] = useState([]);
    const [playlistRecommendation, setPlaylistRecommendation] = useState([]);
    const searchStatus = useSelector(selectSearchStatus);
    const playlistResults = useSelector(selectPlaylistResults);
    useEffect(() => {
        async function fetchCommonKeywords() {
            const res = await api.getCommonKeyword();
            const data = await res.data.data;
            setCommonKeywords(data);
        }

        async function fetchPlaylistRecommendation() {
            const res = await api.getPlaylistRecommendation();
            const data = await res.data.data;
            setPlaylistRecommendation(data);
        }

        function fetchRecentlyKeywork() {
            const keywords = getRecentlyKeywork();
            if (keywords) {
                setRecentlyKeywords(keywords);
            }
        }

        fetchRecentlyKeywork();
        fetchPlaylistRecommendation();
        fetchCommonKeywords();
    }, []);

    const getPlaylistImgWidth = (spaceBetween) => {
        const numItemPerLine = isSm ? 3 : 5;
        const width = wrapperRef.current.clientWidth;
        let innerWidth = width - 48;
        const spaceToBeSubstrcted = ((numItemPerLine - 1) * spaceBetween) / numItemPerLine;
        return (innerWidth / numItemPerLine) - spaceToBeSubstrcted;
    }

    return (
        <Box
            ref={wrapperRef}
            sx={{
                bgcolor: COLORS.bg2,
                width: isSm ? '100%' : `calc((60 * (100% - ${DRAWER_WIDTH}px - 48px)) / 100)`,
                maxHeight: isSm ? `calc(100vh - ${HEADER_HEIGHT_MB})` : `calc(100vh - ${HEADER_HEIGHT})`,
                borderRadius: '4px',
                position: 'fixed',
                top: '70px',
                p: isSm ? '32px 0' : '32px 0',
                left: isSm ? 0 : `${DRAWER_WIDTH + 24}px`,
                zIndex: '1300',
                overflow: isSm ? 'scroll' : 'auto',
                boxSizing: 'border-box',
                '::-webkit-scrollbar': {
                    width: '6px'
                },

                '::-webkit-scrollbar-track': {
                    borderRadius: '5px',
                },

                '::-webkit-scrollbar-thumb': {
                    background: COLORS.bg3,
                    borderRadius: '5px'
                },

                ':hover': {
                    overflowY: 'auto'
                }
            }}
        >
            {
                !searchStatus && (
                    <Box
                        sx={{
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                ...flexStyle('center', 'flex-start'),
                                flexDirection: 'column',
                                rowGap: '16px',
                                width: '100%'
                            }}
                        >
                            {
                                recentlyKeywords.map((i, idx) => (
                                    <Link
                                        href={`/search?searchKey=${i}`}
                                        key={idx}
                                        style={{
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                ...flexStyle('flex-start', 'center'),
                                                columnGap: '8px',
                                                width: '100%',
                                                p: isSm ? '0 23px' : '0 32px',
                                                boxSizing: 'border-box',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <AccessTime />
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content2,
                                                    color: COLORS.white,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >{i}</Typography>
                                        </Box>
                                    </Link>
                                ))
                            }

                        </Box>
                        <Divider sx={{ borderBottomColor: COLORS.placeHolder, m: '32px 0 ' }} />
                        <Box
                            sx={{
                                p: isSm ? '0 15px ' : '0 32px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    mb: '16px'
                                }}
                            >Từ khóa phổ biến</Typography>
                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'center'),
                                    flexWrap: 'wrap',
                                    columnGap: '8px',
                                    rowGap: '8px'
                                }}
                            >
                                {
                                    commonKeywords.map((i, idx) => (
                                        <Link
                                            href={`/search?searchKey=${i?.name}`}
                                            style={{
                                                textDecoration: 'none'
                                            }}
                                            key={idx}
                                        >
                                            <Chip
                                                label={i?.name}
                                                sx={{
                                                    bgcolor: COLORS.bg3,
                                                    color: COLORS.VZ_Text_content,
                                                    ...TEXT_STYLE.content2
                                                }}
                                            />
                                        </Link>
                                    ))
                                }
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                                mt: '32px',
                                p: isSm ? '0 15px ' : '0 32px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    mb: '16px'
                                }}
                            >Có thể bạn muốn nghe</Typography>
                            {
                                isSm && (
                                    <Swiper
                                        slidesPerView={3.5}
                                        spaceBetween={8}
                                    >
                                        {
                                            playlistRecommendation.map(i => (
                                                <SwiperSlide
                                                    key={i?.id}
                                                    style={{
                                                        height: `${getPlaylistImgWidth()}px`
                                                    }}
                                                >
                                                    <Link
                                                        href={`/play/${i?.id}`}
                                                    >
                                                        <a>
                                                            <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={i?.avatar?.thumb_url} alt={`images ${i?.name}`} ></Thumbnail>
                                                        </a>
                                                    </Link>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                                )
                            }
                            {
                                !isSm && (

                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            width: '100%',
                                            flexWrap: 'wrap',
                                            columnGap: '8px',
                                            rowGap: '8px'
                                        }}
                                    >
                                        {
                                            playlistRecommendation.map(i => (
                                                <Link
                                                    className="playlist-recommendation-item"
                                                    href={`/play/${i?.id}`}
                                                    style={{
                                                        textDecoration: 'none'
                                                    }}
                                                    key={i?.id}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: isSm ? 'calc(100% / 3 - 6.4px)' : 'calc(100% / 5 - 6.4px)'
                                                        }}
                                                    >
                                                        <Thumbnail
                                                            style={{
                                                                width: '100%',
                                                                height: `${getPlaylistImgWidth(8)}px`,
                                                                borderRadius: 3
                                                            }}
                                                            promotion={i?.promotion || ''}
                                                            avtSrc={i?.avatar?.thumb_url}
                                                            alt={`images ${i?.id}`}
                                                        />
                                                    </Box>
                                                </Link>
                                            ))
                                        }
                                    </Box>
                                )
                            }
                        </Box>

                    </Box>
                )
            }
            {
                searchStatus && (
                    <Box
                        sx={{
                            width: '100%',
                            ...flexStyle('center', 'flex-start'),
                            flexDirection: 'column',
                            rowGap: '32px',
                            boxSizing: 'border-box',
                            pl: isSm ? '24px' : '40px'
                        }}
                    >
                        {
                            playlistResults.map(i => (
                                <Link
                                    key={i?.id}
                                    href={`/play/${i?.id}`}
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: '15px',
                                            height: '40px'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '40px',
                                                height: '100%'
                                            }}
                                        >
                                            <img
                                                src={i?.avatar?.thumb_url}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                ...flexStyle('center', 'space-between'),
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content1,
                                                    color: COLORS.white,
                                                    display: '-webkit-box',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >{i?.name}</Typography>
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content2,
                                                    color: '#9B9B9B',
                                                    display: '-webkit-box',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >Tác giả</Typography>
                                        </Box>
                                    </Box>
                                </Link>

                            ))
                        }
                    </Box>
                )
            }
        </Box>
    )
}