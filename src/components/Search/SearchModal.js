
// import react
import { useState, useEffect, useRef } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

import { selectSearchStatus, selectPlaylistResults, handleCloseSearch } from '../../redux/OpenSearch';

// import next link
import Link from 'next/link';

// import MUI components
import {
    Typography,
    Box,
    Divider,
    Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// import others components
import Thumbnail from '../Thumbnail/Thumbnail';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
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

    return (
        <Box
            ref={wrapperRef}
            sx={{
                bgcolor: COLORS.bg2,
                width: isSm ? '100%' : '40%',
                borderRadius: '4px',
                p: isSm ? '32px 23px' : '32px',
                position: 'fixed',
                top: '70px',
                left: isSm ? 0 : '300px',
                zIndex: '1300',
                boxSizing: 'border-box'
            }}
        >
            {
                !searchStatus && (
                    <Box
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                ...flexStyle('center', 'flex-start'),
                                flexDirection: 'column',
                                rowGap: '16px'
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
                                                columnGap: '8px'
                                            }}
                                        >
                                            <AccessTimeIcon sx={{ color: COLORS.contentIcon }} />
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content2,
                                                    color: COLORS.white
                                                }}
                                            >{i}</Typography>
                                        </Box>
                                    </Link>
                                ))
                            }

                        </Box>
                        <Divider sx={{ borderBottomColor: COLORS.placeHolder, m: '32px 0 ' }} />
                        <Box>
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
                                            href={`/search?searchKey=${i.name}`}
                                            style={{
                                                textDecoration: 'none'
                                            }}
                                            key={idx}
                                        >
                                            <Chip
                                                label={i.name}
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
                                mt: '32px'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    mb: '16px'
                                }}
                            >Có thể bạn muốn nghe</Typography>
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
                                            href={`/playlists/${i?.id}`}
                                            style={{
                                                textDecoration: 'none',
                                                width: 'calc(100% / 5 - 6.4px)'
                                            }}
                                            key={i.id}
                                        >
                                            <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={i?.avatar?.thumb_url} alt={`images ${i?.id}`} />
                                        </Link>
                                    ))
                                }
                            </Box>
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
                            rowGap: '18px'
                        }}
                    >
                        {
                            playlistResults.map(i => (
                                <Link
                                    key={i.id}
                                    href={`/playlists/${i.id}`}
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
                                            <img src={i.avatar.thumb_url} style={{ width: '100%', height: '100%' }} />
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
                                            >{i.name}</Typography>
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