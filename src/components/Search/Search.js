
// import react
import { useState, useEffect, useMemo } from 'react';

// import next router
import { useRouter } from 'next/router';

// import next link
import Link from 'next/link';

// import MUI components
import {
    Typography,
    Box,
    Chip,
    Button,
    Divider,
    Card,
    CardContent
} from '@mui/material';

// import others components
import Thumbnail from '../Thumbnail/Thumbnail';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import getRecentlyKeywork from '../../utils/getRecentlyKeywordsFromLocal';
import setRecentlyKeywork from '../../utils/setRecentlyKeyword';
import formatDuration from '../../utils/formatDuration';

// import service
import API from '../../services/api';

function useQuery() {
    const { search } = useRouter();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const tabs = [
    {
        name: 'Playlist',
        type: 'playlists'
    },
    {
        name: 'Audio',
        type: 'audios'
    },
    {
        name: 'Tác giả',
        type: 'authors'
    },
    {
        name: 'Kênh',
        type: 'channels'
    }
]

const SearchResult = (props) => {
    const { searchResults, type, spaceBetween, isSm, playlistImgWidth, numItemPerLine } = props;
    const playlistRowGap = isSm ? 16 : 32;
    switch (type) {
        case 'playlists':
            return (
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: `${spaceBetween}px`,
                        flexWrap: 'wrap',
                        rowGap: `${playlistRowGap}px`,
                        mb: '48px'
                    }}
                >
                    {searchResults.map((item) => (
                        <Link
                            key={item.id}
                            href={`/${type}/${item.id}`}
                            style={{ width: `calc(100% / ${isSm ? numItemPerLine : 5} - ${((numItemPerLine - 1) * playlistRowGap) / numItemPerLine}px)`, height: `${playlistImgWidth}px` }}
                        >
                            <a>
                                <Thumbnail key={item.id} style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item.name}`} />
                            </a>
                        </Link>
                    ))}
                </Box>


            )
        case 'audios':
            return (
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        flexDirection: 'column',
                        rowGap: isSm ? 0 : '24px',
                        mb: '48px'
                    }}
                >
                    {
                        searchResults.map(i => (
                            <Box
                                key={i?.id}
                                sx={{
                                    width: '100%',
                                    height: isSm ? '74px' : '116px',
                                    ...flexStyle('flex-start', 'center')
                                }}
                            >
                                <Link
                                    href={`/audio-play/${i?.id}`}
                                    style={{ textDecoration: 'none', height: '100%', width: '100%' }}
                                >
                                    <Card
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: isSm ? '10px' : '20px',
                                            bgcolor: 'inherit',
                                            boxShadow: 'none',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: isSm ? '40px' : '100px',
                                                height: isSm ? '40px' : '100px',
                                                position: 'relative'
                                            }}
                                        >
                                            <img
                                                style=
                                                {{
                                                    width: isSm ? '40px' : '100px',
                                                    height: isSm ? '40px' : '100px',
                                                    borderRadius: '50%'
                                                }}
                                                src={i?.avatar?.thumb_url}
                                                alt={`images ${i.name}`}
                                            />
                                            <PlayArrowIcon
                                                fontSize={isSm ? "small" : "large"}
                                                sx={{
                                                    position: 'absolute',
                                                    color: COLORS.white,
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%,-50%)'
                                                }}
                                            />
                                        </Box>
                                        <CardContent
                                            sx={{
                                                ...flexStyle('space-between', 'flex-start'),
                                                flexDirection: 'column',
                                                flex: '1 0 auto',
                                                p: 0,
                                                height: '100%',
                                                width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 120px)',
                                                '&:last-child': {
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    ...flexStyle('space-between', 'center'),
                                                    width: '100%',
                                                    borderBottom: `1px solid ${COLORS.bg2}`,
                                                    height: '100%',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        ...flexStyle('center', 'flex-start'),
                                                        flexDirection: 'column',
                                                        flex: '1 0 auto',
                                                        rowGap: '6px',
                                                        width: isSm ? '100%' : '75%',
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
                                                    >
                                                        {i?.name}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            ...flexStyle('flex-start', 'center'),
                                                            columnGap: '6px'
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                                color: COLORS.contentIcon,
                                                                display: '-webkit-box',
                                                                textOverflow: 'ellipsis',
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {i?.playlist?.name}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {
                                                    !isSm && (
                                                        <Box
                                                            sx={{
                                                                ...flexStyle('flex-start', 'center'),
                                                                columnGap: '11px',
                                                                width: '20%'
                                                            }}
                                                        >
                                                            <AccessTimeIcon sx={{ color: COLORS.VZ_Text_content }} />
                                                            <Typography
                                                                sx={{
                                                                    ...TEXT_STYLE.content1,
                                                                    color: COLORS.VZ_Text_content
                                                                }}
                                                            >
                                                                {formatDuration(i?.duration)}
                                                            </Typography>
                                                        </Box>
                                                    )
                                                }
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Box>
                        ))
                    }
                </Box>
            )
        case 'authors':
            return (
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        flexDirection: 'column',
                        rowGap: isSm ? 0 : '24px',
                        mb: '48px'
                    }}
                >
                    {
                        searchResults.map(i => (
                            <Box
                                key={i?.id}
                                sx={{
                                    width: '100%',
                                    height: isSm ? '74px' : '116px',
                                    ...flexStyle('flex-start', 'center')
                                }}
                            >
                                <Link
                                    href={`/authors/${i?.id}`}
                                    style={{ textDecoration: 'none', height: '100%', width: '100%' }}
                                >
                                    <Card
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: isSm ? '10px' : '20px',
                                            bgcolor: 'inherit',
                                            boxShadow: 'none',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: isSm ? '40px' : '100px',
                                                height: isSm ? '40px' : '100px',
                                                position: 'relative'
                                            }}
                                        >
                                            <img
                                                style=
                                                {{
                                                    width: isSm ? '40px' : '100px',
                                                    height: isSm ? '40px' : '100px',
                                                    borderRadius: '50%'
                                                }}
                                                src={i?.avatar?.thumb_url}
                                                alt={`images ${i.name}`}
                                            />
                                        </Box>
                                        <CardContent
                                            sx={{
                                                ...flexStyle('space-between', 'flex-start'),
                                                flexDirection: 'column',
                                                flex: '1 0 auto',
                                                p: 0,
                                                height: '100%',
                                                width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 120px)',
                                                '&:last-child': {
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    ...flexStyle('space-between', 'center'),
                                                    width: '100%',
                                                    borderBottom: `1px solid ${COLORS.bg2}`,
                                                    height: '100%',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        ...flexStyle('center', 'flex-start'),
                                                        flexDirection: 'column',
                                                        flex: '1 0 auto',
                                                        rowGap: '6px',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                            color: COLORS.white,
                                                            display: '-webkit-box',
                                                            textOverflow: 'ellipsis',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {i?.name}
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            ...flexStyle('flex-start', 'center'),
                                                            columnGap: '6px'
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                                color: COLORS.contentIcon,
                                                                display: '-webkit-box',
                                                                textOverflow: 'ellipsis',
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {i?.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Box>
                        ))
                    }
                </Box>
            )
        case 'channels':
            return (
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        flexDirection: 'column',
                        rowGap: '24px',
                        mb: '48px'
                    }}
                >
                    {
                        searchResults.map(i => (
                            <Box
                                key={i?.id}
                                sx={{
                                    width: '100%',
                                    height: isSm ? '74px' : '116px',
                                    ...flexStyle('flex-start', 'center')
                                }}
                            >
                                <Link
                                    key={i?.id}
                                    href={`/${type}/${i?.id}`}
                                    style={{ textDecoration: 'none', height: '100%', width: '100%' }}
                                >
                                    <Card
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: isSm ? '10px' : '20px',
                                            bgcolor: 'inherit',
                                            boxShadow: 'none',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: isSm ? '40px' : '100px',
                                                height: isSm ? '40px' : '100px',
                                                position: 'relative'
                                            }}
                                        >
                                            <img
                                                style=
                                                {{
                                                    width: isSm ? '40px' : '100px',
                                                    height: isSm ? '40px' : '100px',
                                                    borderRadius: '50%'
                                                }}
                                                src={i?.avatar?.thumb_url}
                                                alt={`images ${i.name}`}
                                            />
                                        </Box>
                                        <CardContent
                                            sx={{
                                                ...flexStyle('space-between', 'flex-start'),
                                                flexDirection: 'column',
                                                flex: '1 0 auto',
                                                p: 0,
                                                height: '100%',
                                                width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 120px)',
                                                '&:last-child': {
                                                    p: 0
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    ...flexStyle('space-between', 'center'),
                                                    width: '100%',
                                                    borderBottom: `1px solid ${COLORS.bg2}`,
                                                    height: '100%',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        ...flexStyle('center', 'flex-start'),
                                                        flexDirection: 'column',
                                                        flex: '1 0 auto',
                                                        rowGap: '6px',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                            color: COLORS.white,
                                                            display: '-webkit-box',
                                                            textOverflow: 'ellipsis',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {i?.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Box>
                        ))
                    }
                </Box>
            )
    }
}

function Search() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [type, setType] = useState('playlists');
    const [searchResults, setSearchResults] = useState([]);
    const [searchMeta, setSearchMeta] = useState({});
    const [resetStateFlag, setResetStateFlag] = useState(false);
    const queryParams = useQuery();
    const searchKey = queryParams.get('searchKey');
    const NUMBER_ITEMS_PER_LINE = isSm ? 3 : 5;
    const SIDE_PADDING = 48;
    const SPACE_BETWEEN = isSm ? 16 : 24;

    useEffect(() => {
        const params = {
            type,
            searchKey,
            nextOffset: null,
            language: null,
            nextQueryType: null
        };

        updateRecentlyKeywords();
        fetchSearchResult(params);
    }, [resetStateFlag]);

    useEffect(() => {
        setSearchResults([]);
        setSearchMeta({});
        setResetStateFlag(!resetStateFlag);
    }, [type, searchKey]);

    useEffect(() => {
        updateRecentlyKeywords();
    }, []);

    const fetchSearchResult = async (params) => {
        try {
            const res = await api.getSearchResults(
                params.type,
                params.searchKey,
                params.nextOffset,
                params.language,
                params.nextQueryType
            );
            const data = await res.data;
            setSearchResults([...searchResults, ...data.data]);
            if (['playlists', 'audios'].includes(type)) {
                setSearchMeta({ ...data.meta });
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleClickSearchTab = (type) => {
        setType(type);
    }

    const getPlaylistImgWidth = () => {
        const width = windowSize.width;
        let innerWidth = width - SIDE_PADDING * 2;
        const spaceToBeSubstracted = ((NUMBER_ITEMS_PER_LINE - 1) * SPACE_BETWEEN) / NUMBER_ITEMS_PER_LINE;
        if (!isSm) {
            innerWidth -= DRAWER_WIDTH;
        }
        return (innerWidth / NUMBER_ITEMS_PER_LINE) - spaceToBeSubstracted;
    }

    const updateRecentlyKeywords = () => {
        let recentlyKeywork = getRecentlyKeywork() || [];
        recentlyKeywork.push(searchKey);
        recentlyKeywork = [...new Set(recentlyKeywork)];
        if (recentlyKeywork.length > 5) {
            recentlyKeywork = recentlyKeywork.slice(1);
        }
        setRecentlyKeywork(recentlyKeywork)
    }

    const handleLoadMoreSearch = () => {
        const params = {
            type: type,
            searchKey: searchKey,
            nextOffset: null,
            language: null,
            nextQueryType: null
        }
        if (['playlists', 'audios'].includes(type)) {
            params['nextOffset'] = searchMeta.next_offset;
            params['nextQueryType'] = searchMeta.next_query_type;
            params['language'] = searchMeta.language;
        }
        fetchSearchResult(params);
    }

    return (
        <Box
            sx={{
                p: `${SIDE_PADDING}px`,
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            <Box
                sx={{
                    mb: isSm ? '32px' : '48px'
                }}
            >
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white
                    }}
                >
                    Kết quả tìm kiếm cho "{searchKey}"
                </Typography>
            </Box>
            <Box
                sx={{
                    ...flexStyle('flex-start', 'center'),
                    columnGap: '8px'
                }}
            >
                {
                    tabs.map((i) => (
                        <Chip
                            key={i.name}
                            label={i.name}
                            sx={{
                                bgcolor: (i.type === type) ? COLORS.bg3 : 'transparent',
                                color: COLORS.VZ_Text_content,
                                ...TEXT_STYLE.content2,
                                ':hover': {
                                    bgcolor: COLORS.bg3
                                }
                            }}
                            onClick={() => { handleClickSearchTab(i.type) }}
                        />
                    ))
                }
            </Box>
            <Divider sx={{ borderBottomColor: COLORS.bg2, mt: isSm ? '16px' : '24px', mb: isSm ? '16px' : '48px' }} />
            <Box>
                {
                    (searchResults.length > 0) && (
                        <SearchResult
                            searchResults={searchResults}
                            type={type}
                            isSm={isSm}
                            playlistImgWidth={getPlaylistImgWidth()}
                            spaceBetween={SPACE_BETWEEN}
                            numItemPerLine={NUMBER_ITEMS_PER_LINE}
                        />
                    )
                }
                {
                    (searchResults.length === 0) && (
                        <Box
                            sx={{
                                pt: isSm ? '65px' : '53px',
                                width: isSm ? '80%' : '30%',
                                textAlign: 'center',
                                ml: 'auto',
                                mr: 'auto',
                            }}
                        >
                            <img src='/images/search404.png' alt='search404' />
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content1,
                                    color: COLORS.bg4,
                                    mt: '32px'
                                }}
                            >
                                Không tìm thấy từ khóa phù hợp
                            </Typography>
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content1,
                                    color: COLORS.bg4
                                }}
                            >
                                Hãy thử với từ khóa khác
                            </Typography>
                        </Box>
                    )
                }
            </Box>
            {
                (searchMeta?.next_offset) && (
                    <Box
                        sx={{
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        <Button
                            onClick={handleLoadMoreSearch}
                            sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                width: '142px',
                                height: '48px',
                                border: `1px solid ${COLORS.blackStroker}`
                            }}
                        >
                            Xem thêm
                        </Button>
                    </Box>
                )
            }
        </Box>
    )
}

export default withRouter(Search)