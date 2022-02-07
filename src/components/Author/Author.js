// import react
import { useState, useEffect } from 'react';

// import next router
import { useRouter } from 'next/router';

// import next link
import Link from 'next/link';

// import MUI components
import {
    Box,
    Avatar,
    Typography
} from '@mui/material';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

const PlaylistAudioCount = (props) => {
    const { audioCount, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: '6px'
            }}
        >
            <GraphicEqOutlinedIcon sx={{ color: COLORS.contentIcon, width: isSm ? '12px' : '16px', height: isSm ? '12px' : '16px' }} />
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                    color: COLORS.contentIcon
                }}
            >
                {audioCount} audios
            </Typography>
        </Box>
    )
}

export default function Author({ author }) {
    const api = new API();

    const router = useRouter();
    const windowSize = useWindowSize();
    const [id, setId] = useState(null);
    const [featuredAuthors, setFeaturedAuthors] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const isSm = windowSize.width > SCREEN_BREAKPOINTS.sm ? false : true;

    useEffect(() => {
        async function fetchFeaturedAuthors() {
            const res = await api.getFeaturedAuthors(id);
            const data = await res.data.data;
            setFeaturedAuthors(data);
        }
        async function fetchPlaylists() {
            const res = await api.getAuthorPlaylists(id);
            const data = await res.data.data;
            setPlaylists(data);
        }

        if (id) {
            fetchFeaturedAuthors();
            fetchPlaylists();
        }
    }, [id]);

    useEffect(() => {
        const { id } = router.query;
        setId(id);
    }, [router.query]);

    const getFeaturedAuthorWidth = () => {
        const el = document.getElementById('author-detail-info');
        const innerWidth = el.clientWidth;
        const widthPerItems = (innerWidth - 64) / 3 - ((2 * 20) / 3);
        return widthPerItems;
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
                    height: '40vh',
                    background: '#222530'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        sx={{
                            width: isSm ? '140px' : '160px',
                            height: isSm ? '140px' : '160px',
                            mb: '40px'
                        }} alt="Remy Sharp" src={author?.avatar?.thumb_url}
                    />
                    <Typography
                        sx={{
                            ...TEXT_STYLE.h2,
                            color: COLORS.white,
                            mb: '16px'
                        }}
                    >{author?.name}</Typography>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                    >
                        <PhotoLibraryOutlinedIcon sx={{ color: COLORS.white }} />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white
                            }}
                        >{author?.author_counter?.playlists_count} albums</Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    ...flexStyle('space-between', 'stretch'),
                    ...(isSm && { flexDirection: 'column' }),
                    p: isSm ? '16px 0' : '48px',
                    boxSizing: 'border-box'
                }}
            >
                <Box
                    id='author-detail-info'
                    sx={{
                        width: isSm ? '100%' : '40%',
                        ...flexStyle('flex-start', 'center'),
                        flexDirection: 'column',
                        rowGap: isSm ? '16px' : '32px',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            bgcolor: COLORS.bg2
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                p: isSm ? '26px 16px' : '26px 32px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                    color: COLORS.white,
                                    marginBottom: isSm ? '16px' : '32px'
                                }}
                            >Giới thiệu</Typography>
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.VZ_Text_content
                                }}
                            >{author?.description}
                            </Typography>
                        </Box>
                    </Box>
                    {isSm && (
                        <Box
                            sx={{
                                width: '100%',
                                bgcolor: COLORS.bg2
                            }}
                        >
                            <Box
                                sx={{
                                    p: isSm ? '26px 16px' : '26px 32px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                        color: COLORS.white,
                                        marginBottom: '32px'
                                    }}
                                >Danh sách album ({author?.author_counter?.playlists_count} albums)</Typography>
                                <Box
                                    sx={{
                                        ...flexStyle('center', 'flex-start'),
                                        flexDirection: 'column',
                                        rowGap: '32px'
                                    }}
                                >
                                    {
                                        playlists.map(i => (
                                            <PlaylistThumnail
                                                width='100%'
                                                key={i?.id}
                                                id={i?.id}
                                                name={i.name}
                                                src={i?.avatar?.thumb_url}
                                                authors={i?.authors}
                                                children={<PlaylistAudioCount isSm={isSm} audioCount={i?.playlist_counter?.audios_count} />
                                                }
                                            />
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    )}
                    <Box
                        sx={{
                            width: '100%',
                            bgcolor: COLORS.bg2
                        }}
                    >
                        <Box
                            sx={{
                                p: isSm ? '26px 18px' : '26px 32px',
                                boxSizing: 'border-box',
                                width: '100%'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                    color: COLORS.white,
                                    marginBottom: '32px'
                                }}
                            >Tác giả nổi bật</Typography>
                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'stretch'),
                                    flexWrap: 'wrap',
                                    columnGap: '20px',
                                    rowGap: '33px'
                                }}
                            >
                                {
                                    featuredAuthors.map(i => (
                                        <Box
                                            key={i?.id}
                                            sx={{
                                                width: 'calc(100% / 3 - 13.4px)'
                                            }}
                                        >
                                            <Link
                                                href={`/authors/${i?.id}`}
                                                style={{
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        ...flexStyle('center', 'center'),
                                                        flexDirection: 'column',
                                                        rowGap: '8px'
                                                    }}
                                                >
                                                    <Avatar
                                                        style={{
                                                            width: '100%',
                                                            height: `${getFeaturedAuthorWidth()}px`
                                                        }}
                                                        src={i?.avatar?.thumb_url} alt={`image ${i?.name}`}
                                                    />
                                                    <Box
                                                        sx={{
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                ...TEXT_STYLE.title3,
                                                                color: COLORS.white
                                                            }}
                                                        >{i?.name}</Typography>
                                                    </Box>
                                                </Box>
                                            </Link>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {
                    !isSm && (
                        <Box
                            sx={{
                                width: '57%',
                                bgcolor: COLORS.bg2
                            }}
                        >
                            <Box
                                sx={{
                                    p: '26px 32px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h2,
                                        color: COLORS.white,
                                        marginBottom: '32px'
                                    }}
                                >Danh sách album ({author?.author_counter?.playlists_count} albums)</Typography>
                                <Box
                                    sx={{
                                        ...flexStyle('center', 'flex-start'),
                                        flexDirection: 'column',
                                        rowGap: '32px'
                                    }}
                                >
                                    {
                                        playlists.map(i => (
                                            <PlaylistThumnail
                                                width='100%'
                                                key={i?.id}
                                                id={i?.id}
                                                name={i.name}
                                                src={i?.avatar?.thumb_url}
                                                authors={i?.authors}
                                                children={<PlaylistAudioCount isSm={isSm} audioCount={i?.playlist_counter?.audios_count} />}
                                            />
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    )
                }
            </Box>
        </Box>
    )
}