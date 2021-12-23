// import react
import { useEffect, useState } from 'react';

// import react router dom
import { Link } from 'react-router-dom';

// import MUI components
import {
    Typography,
    Box,
    Divider,
    Button
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// import others components
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import CategoryBarWithoutSwiper from '../../components/Shared/CategoryBarWithoutSwiper';
import PlaylistByCategory from '../../components/Shared/PlaylistByCategory';
import PublisherComponent from '../../components/Shared/PublisherComponent';

// import icons
import { RightArrow } from '../../components/Icons/index';

// import utils
import { SCREEN_BREAKPOINTS, TEXT_STYLE, COLORS, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { flexStyle } from '../../utils/flexStyle'

// import service
import API from '../../services/api';

const Title = (props) => {
    const { isSm, content, haveArrow } = props
    return (
        < Box sx={{
            ...flexStyle('flex-start', 'center'),
            marginBottom: '24px'
        }}>
            <Typography sx={{
                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                color: COLORS.white
            }}>
                {content}
            </Typography>
            {
                haveArrow && (
                    <Box sx={{ marginLeft: '11.3px', marginTop: '6px' }}>
                        <RightArrow fill={COLORS.white} />
                    </Box>
                )
            }

        </ Box >
    )
}

const RandomPlayList = (props) => {
    const { data, isSm } = props;
    const height = isSm ? '153px' : '200px';
    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                width: isSm ? '100%' : 'calc(50% - 14px)',
                height: height,
                bgcolor: COLORS.bg2,
                borderRadius: '4px',
                columnGap: isSm ? '11px' : '18px'
            }}
        >

            <img src={data?.avatar?.thumb_url} style={{ width: height, height: height }} />
            <Box
                sx={{
                    width: `calc(100% - ${height})`,
                    p: '20px 0',
                    boxSizing: 'border-box',

                }}
            >
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                        color: COLORS.white,
                        textAlign: 'left',
                        display: '-webkit-box',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: '6px'
                    }}
                >{data.name}</Typography>
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: '6px',
                        mb: '6px'
                    }}
                >
                    <AccountCircleOutlinedIcon sx={{ color: COLORS.contentIcon, width: isSm ? '12px' : '16px', height: isSm ? '12px' : '16px' }} />
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                            color: COLORS.contentIcon
                        }}
                    >
                        Author
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2),
                        color: COLORS.VZ_Text_content,
                        textAlign: 'left',
                        display: '-webkit-box',
                        textOverflow: 'ellipsis',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {data.description}
                </Typography>
            </Box>
        </Box>
    )
}

export default function AudioBook() {

    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const SPACE_BETWEEN = 24;
    const NUMBER_ITEMS_PER_LINE = isSm ? 2.5 : 5;
    const SIDE_PADDING = isSm ? 19 : 48;
    const [categories, setCategoryies] = useState([]);
    const [categoryCode, setCategoryCode] = useState(null)
    const [categoryName, setCategoryName] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [playlistsRandom, setPlaylistsRandom] = useState([]);
    const [initPlaylists, setInitPlaylists] = useState([]);

    useEffect(() => {
        async function fetchCategories() {
            const res = await api.getCategories('audio_book', 'Audiobook');
            const data = await res.data.data;
            setCategoryies(data)
        };
        async function fetchPlaylistsRandom() {
            const res = await api.getPlaylistsRandom(12);
            const data = await res.data.data;
            setPlaylistsRandom(data);
        }

        fetchCategories();
        fetchPlaylistsRandom();
    }, []);

    useEffect(() => {
        async function initPlaylists() {
            const initCategories = categories.filter(i => i.sub_name !== '');
            const resultPromise = [];
            initCategories.forEach(i => {
                const res = api.getCategoryPlaylists(i.code, 10);
                resultPromise.push(res);
            })
            const data = await Promise.all(resultPromise);
            const results = data.map((i, idx) => ({ name: initCategories[idx]['sub_name'], data: i.data.data }));
            setInitPlaylists(results);
        }
        initPlaylists();
    }, [categories]);

    useEffect(() => {
        async function fetchPlaylists() {
            if (categoryCode === null || categoryCode === '') {
                return;
            }
            else {
                const res = await api.getCategoryPlaylists(categoryCode, 35);
                const results = await res.data.data;
                setPlaylists(results);
            }
        }

        fetchPlaylists();
    }, [categoryCode])

    const getPlaylistImgWidth = () => {
        const width = windowSize.width;
        let innerWidth = width - SIDE_PADDING * 2;
        const spaceToBeSubstrcted = ((NUMBER_ITEMS_PER_LINE - 1) * SPACE_BETWEEN) / NUMBER_ITEMS_PER_LINE;
        if (!isSm) {
            innerWidth -= DRAWER_WIDTH;
        }
        return (innerWidth / NUMBER_ITEMS_PER_LINE) - spaceToBeSubstrcted;
    }

    const getInnerWidth = () => {
        const width = windowSize.width;
        let innerWidth = width - SIDE_PADDING * 2;
        if (!isSm) {
            innerWidth -= DRAWER_WIDTH;
        }
        return innerWidth;
    }

    const onSelectCategory = (categoryCode) => {
        if (categoryCode !== null && categoryCode !== '') {
            const category = categories.filter(i => i.code === categoryCode)[0];
            const categoryName = !!category.sub_name ? category.sub_name : category.name
            setCategoryName(categoryName);
        }
        setCategoryCode(categoryCode);
    }

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <HomeCarousel windowWidth={windowSize.width} />
            <Box
                sx={{
                    p: `0 ${SIDE_PADDING}px`
                }}
            >
                <CategoryBarWithoutSwiper categoryList={categories} isSm={isSm} windowWidth={getInnerWidth()} onSelectCategory={onSelectCategory} />
                <Divider sx={{ borderColor: COLORS.bg2, mt: '24px', mb: '48px' }} />
                {
                    (categoryCode === null || categoryCode === '') && (
                        <Box>
                            {
                                initPlaylists.map(i => (
                                    <PlaylistByCategory key={i.name} i={i} isSm={isSm} playlistImgWidth={getPlaylistImgWidth()} />
                                ))
                            }
                        </Box>
                    )
                }
                {
                    (categoryCode !== null && categoryCode !== '') && (
                        <Box>
                            {
                                <Box>
                                    {<Title content={categoryName} isSm={isSm} haveArrow={false} />}
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: isSm ? '16px' : '24px',
                                            mb: '56px',
                                            flexWrap: 'wrap',
                                            rowGap: isSm ? '16px' : '32px'
                                        }}
                                    >
                                        {playlists.map((item) => (
                                            <Link
                                                to={`/playlists/${item.id}`}
                                                style={{ width: `calc(100% / ${isSm ? 2 : 5} - 19.2px)`, height: `${getPlaylistImgWidth()}px` }}
                                            >
                                                <Thumbnail key={item.id} style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item.avatar.thumb_url} alt={`images ${item.name}`} />
                                            </Link>
                                        ))}
                                    </Box>
                                </Box>

                            }
                        </Box>
                    )
                }
            </Box>
            <Box
                sx={{
                    width: '100%'
                }}
            >
                <img src='https://picsum.photos/1190/420?img=2' style={{ width: '100%', height: '260px' }} />
            </Box>
            <Box
                sx={{
                    p: `0 ${SIDE_PADDING}px`,
                    mt: '58px',
                    ...flexStyle('flex-start', 'center'),
                    rowGap: isSm ? '20px' : '22px',
                    flexWrap: 'wrap',
                    ...(isSm && { columnGap: '28px' })
                }}
            >
                {
                    playlistsRandom.map(i => (
                        <RandomPlayList key={i.id} data={i} isSm={isSm} />
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
                    >
                        Xem thêm
                    </Button>
                </Box>
            </Box>
            <PublisherComponent isSm={isSm} />
        </Box >
    )
}