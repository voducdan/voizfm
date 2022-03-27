// import react
import { useEffect, useState } from 'react';

// import next router
import { useRouter } from 'next/router';

// import MUI components
import {
    Typography,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Snackbar,
    Alert
} from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail'

// import utils
import { SCREEN_BREAKPOINTS, TEXT_STYLE, COLORS, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { flexStyle } from '../../utils/flexStyle';
import formatDuration from '../../utils/formatDuration';
import ShareModal from '../../components/Shared/ShareModal';

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

export default function ChannelDetail({ channelFromAPI }) {

    const api = new API();
    const windowSize = useWindowSize();
    const router = useRouter();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const { id } = useRouter().query;
    const [channel, setChannel] = useState(channelFromAPI);
    const [url, setUrl] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [audios, setAudios] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [openShareModal, setOpenShareModal] = useState(false);

    useEffect(() => {
        async function fetchPlaylists() {
            const res = await api.getChannelPlaylists(id);
            const data = await res.data.data;
            setPlaylists(data);
        }
        async function fetchAudios() {
            const res = await api.getChannelAudio(id);
            const data = await res.data.data;
            setAudios(data);
        }

        fetchPlaylists();
        fetchAudios();
    }, []);


    useEffect(() => {
        setUrl(window.location.href);
    }, [router.query]);

    const handleBookmark = () => {
        async function bookmarkChannel(cb) {
            try {
                const res = await api.bookmarkChannel(id);
                const data = await res.data;
                if (data.error) {
                    setOpenSnackbar(true);
                    setErrorMessage('Đánh dấu playlist không thành công!');
                    return;
                }
                cb(data.data);
            }
            catch (err) {
                setErrorMessage('Đánh dấu kênh không thành công!')
                setOpenSnackbar(true);
                console.log(err);
            }
        }

        bookmarkChannel(updatedBookmarkStatus);
    }

    const updatedBookmarkStatus = (data) => {
        const updatedChannel = { ...channel };
        updatedChannel['is_bookmark'] = !updatedChannel['is_bookmark'];
        updatedChannel['channel_counter']['bookmarks_count'] = data['bookmarks_count'];
        setChannel({ ...updatedChannel });
    }

    const handleOpenShareModal = () => {
        setOpenShareModal(true)
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
                    height: isSm ? '272px' : '390px',
                    ...flexStyle('flext-start', 'flex-start'),
                    p: isSm ? '25px 21px' : '50px 0',
                    boxSizing: 'border-box',
                    mb: isSm ? '16px' : '40px',
                    position: 'relative',
                    '&::before': {
                        content: "''",
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: "url('/images/bgchannelDetail.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        opacity: 0.4
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        columnGap: isSm ? '30px' : '48px',
                        pr: isSm ? 0 : '50px',
                        boxSizing: 'border-box',
                        height: '100%'
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            ...flexStyle('center', 'flex-start')
                        }}
                    >
                        <img
                            style={{
                                width: isSm ? '110px' : '210px',
                                height: isSm ? '110px' : '210px',
                                borderRadius: '4px'
                            }} alt={`image ${channel?.name}`} src={channel?.avatar?.thumb_url}
                        />
                    </Box>
                    <Box
                        sx={{
                            height: '100%',
                            width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 210px)',
                            ...flexStyle('space-around', 'flex-start'),
                            ...(isSm && { flexDirection: 'column', rowGap: '20px' }),
                            columnGap: '10%'
                        }}
                    >
                        <Box
                            sx={{
                                ...flexStyle('flex-start', 'center'),
                                flexDirection: 'column',
                                height: '100%',
                                width: '60%'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    mb: '10px',
                                    mb: isSm ? '8px' : '40px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        width: '100%',
                                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                        color: COLORS.white
                                    }}
                                >{channel?.name}</Typography>
                                <Box
                                    sx={{
                                        ...flexStyle('flex-start', 'center'),
                                        borderLeft: `1px solid ${COLORS.white}`,
                                        pl: '8px',
                                        columnGap: '4px',
                                        mt: '16px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                            color: COLORS.second
                                        }}
                                    >{channel?.channel_counter?.bookmarks_count}</Typography>
                                    <Typography
                                        sx={{
                                            ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.h3),
                                            color: COLORS.contentIcon
                                        }}
                                    >theo dõi</Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                        color: COLORS.VZ_Text_content
                                    }}
                                >{channel?.description}</Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                ...flexStyle('flex-end', 'center'),
                                columnGap: '10%',
                                width: '30%'
                            }}
                        >
                            <IconButton onClick={handleOpenShareModal}>
                                <ShareOutlinedIcon sx={{ color: COLORS.contentIcon }} />
                            </IconButton>
                            <ShareModal url={url} isSm={isSm} open={openShareModal} setOpen={setOpenShareModal}></ShareModal>
                            <Button
                                onClick={handleBookmark}
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                    color: COLORS.white,
                                    borderRadius: '22px',
                                    height: isSm ? '28px' : '48px',
                                    textTransform: 'none',
                                    bgcolor: channel?.is_bookmark ? COLORS.bg3 : COLORS.main,
                                    whiteSpace: 'nowrap',
                                    pl: '24px',
                                    pr: '24px',
                                    ':hover': {
                                        bgcolor: channel?.is_bookmark ? COLORS.bg3 : COLORS.main
                                    }
                                }}
                                startIcon={channel?.is_bookmark ? <CheckIcon /> : <AddIcon />}
                            >{channel?.is_bookmark ? 'Hủy theo dõi' : 'Theo dõi'}</Button>
                        </Box>
                    </Box>
                </Box>

            </Box>
            <Box
                sx={{
                    width: '100%',
                    p: isSm ? 0 : '0 48px',
                    boxSizing: 'border-box',
                    ...flexStyle('center', 'stretch'),
                    ...(isSm && { flexDirection: 'column', rowGap: '16px' }),
                    columnGap: '32px'
                }}
            >
                <Box
                    sx={{
                        width: isSm ? '100%' : 'calc(40% - 16px)',
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
                        >Danh sách album ({channel?.channel_counter?.playlists_count} albums)</Typography>
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
                                        id={i?.id}
                                        key={i?.id}
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
                <Box
                    sx={{
                        width: isSm ? '100%' : 'calc(60% - 16px)',
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
                                marginBottom: isSm ? '26px' : '32px'
                            }}
                        >Danh sách audios</Typography>
                        <Box>
                            <List sx={{ width: '100%' }}>
                                {audios.map(i => {
                                    return (
                                        <ListItem
                                            sx={{
                                                paddingLeft: 0,
                                                paddingRight: '20px',
                                                borderTop: `.5px solid ${COLORS.placeHolder}`,
                                                height: '72px'
                                            }}
                                            key={i?.id}
                                            secondaryAction={
                                                <Typography
                                                    sx={{
                                                        ...TEXT_STYLE.content2,
                                                        color: COLORS.bg4
                                                    }}
                                                >{formatDuration(i?.duration)}</Typography>
                                            }
                                        >
                                            <ListItemButton role={undefined} onClick={() => (1)} dense>
                                                <ListItemText
                                                    sx={{
                                                        'span': {
                                                            ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                            color: COLORS.white,
                                                            display: '-webkit-box',
                                                            textOverflow: 'ellipsis',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }
                                                    }}
                                                    id={`label-${i?.id}`} primary={i?.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => { setOpenSnackbar(false) }}
            >
                <Alert onClose={() => { setOpenSnackbar(false) }} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}