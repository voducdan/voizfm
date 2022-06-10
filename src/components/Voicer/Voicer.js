// import react
import { useState, useEffect } from 'react';

// import redux
import { useSelector } from 'react-redux';

// import reducer, actions
import { selectVoicer } from '../../redux/voicer';

// import next router
import { useRouter } from 'next/router';

// import MUI component
import {
    Box,
    Typography,
    Divider,
    Button
} from '@mui/material';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
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

export default function Voicer() {
    const api = new API();
    const router = useRouter();
    const { id } = router.query;
    const voicer = useSelector(selectVoicer);
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [page, setPage] = useState(1);
    const [hasLoadMore, setHasLoadMore] = useState(false);

    const [voicerPlaylists, setvoicerPlaylists] = useState([]);

    useEffect(() => {
        if (id) {
            fetchVoicerPlaylists(id, page);
        }
    }, [id]);

    async function fetchVoicerPlaylists(id, page) {
        try {
            const res = await api.getVoicerPlaylists(id, page);
            const data = await res.data.data;
            if (data.length < 10) {
                setHasLoadMore(false);
            }
            else {
                setHasLoadMore(true);
            }
            const allPlaylists = [...voicerPlaylists, ...data];
            setvoicerPlaylists(allPlaylists);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleLoadMorePlaylist = () => {
        const nextPage = page + 1;
        fetchVoicerPlaylists(id, nextPage);
        setPage(nextPage);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    height: isSm ? '180px' : '200px',
                    textAlign: 'center',
                    pt: isSm ? '46px' : '40px',
                    pb: isSm ? '36px' : '34px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    '&::before': {
                        content: "''",
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: "url('/images/bggradient.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        opacity: 0.4
                    }
                }}
            >
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white,
                        mb: '24px'
                    }}
                >
                    Người đọc
                </Typography>
                <Typography
                    sx={{
                        ...(isSm && TEXT_STYLE.h1),
                        ...(!isSm && {
                            fontSize: '48px',
                            lineHeight: '72px',
                            fontWeight: 700,
                            fontFamily: 'SF UI Display'
                        }),
                        color: COLORS.white
                    }}
                >
                    {voicer?.name}
                </Typography>
            </Box>
            <Box
                sx={{
                    width: isSm ? '95%' : '100%',
                    ...flexStyle('flex-start', 'center'),
                    flexWrap: 'wrap',
                    p: isSm ? '24px 16px' : '56px 48px',
                    boxSizing: 'border-box',
                    rowGap: isSm ? '24px' : '40px',
                    ...(!isSm && {
                        columnGap: '48px'
                    })
                }}
            >
                {
                    voicerPlaylists.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            id={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.authors}
                            promotion={i?.promotion}
                            children={
                                <PlaylistAudioCount
                                    isSm={isSm}
                                    audioCount={i?.playlist_counter?.audios_count}
                                />
                            }
                        />
                    ))
                }
            </Box>
            {
                hasLoadMore && (
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
                            onClick={handleLoadMorePlaylist}
                        >
                            Xem thêm
                        </Button>
                    </Box>
                )
            }
            <Divider
                sx={{
                    background: COLORS.blackStroker,
                    m: '80px 50px 0 50px'
                }}
            />
        </Box>
    )
}