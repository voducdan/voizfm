// import react
import { useEffect, useState } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/user';
import { setOpenLogin } from '../../redux/openLogin';
import { selectOpenAudioDetail } from '../../redux/playAudio';

// import reducer, actions
import { selectCart } from '../../redux/payment';

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
    Alert,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail';
import PlayAudioDialog from '../../components/Shared/PlayAudioDialog';
import handleAddToCart from '../../components/Shared/handleAddToCart';
import handlePlayAudio from '../../components/Shared/handlePlayAudio';

// import icons
import { Share } from '../../components/Icons/index';

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
                    ...TEXT_STYLE.content1,
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
    const user = useSelector(selectUser);
    const cart = useSelector(selectCart);
    const openAudioDetail = useSelector(selectOpenAudioDetail);
    const [channel, setChannel] = useState(channelFromAPI);
    const [url, setUrl] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [audios, setAudios] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [openUpdateRequiredModal, setOpenUpdateRequiredModal] = useState(false);
    const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [audio, setAudio] = useState(null);
    const [hasLoadMoreAudio, setHasLoadMoreAudio] = useState(true);
    const [audioPage, setAudioPage] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchPlaylists() {
            const res = await api.getChannelPlaylists(id, 1, channel?.channel_counter?.playlists_count);
            const data = await res.data.data;
            setPlaylists(data);
        }
        function fetchAudios(id) {
            getAudios(id, 1)
        }

        if (id) {
            fetchPlaylists();
            fetchAudios(id);
        }
    }, []);


    useEffect(() => {
        setUrl(window.location.href);
    }, [router.query]);

    useEffect(() => {
        if (id) {
            getAudios(id, audioPage)
        }
    }, [audioPage]);

    const getAudios = async (id, page) => {
        const res = await api.getChannelAudio(id, page);
        const data = await res.data.data;
        setAudios([...audios, ...data]);
        if (data.length < 10) {
            setHasLoadMoreAudio(false);
        }
    }

    const handleLoadMoreAudio = () => {
        const newAudioPage = audioPage + 1;
        setAudioPage(newAudioPage);
    }

    const handleBookmark = () => {
        async function bookmarkChannel(cb) {
            if (!user) {
                dispatch(setOpenLogin(true));
                return;
            }
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

    const handlePlayChannelAudio = (audio) => {
        setAudio(audio);
        handlePlayAudio(
            dispatch,
            user,
            audio.id,
            audio.playlist_id,
            'free',
            setErrorMessage,
            setOpenUpdateRequiredModal,
            setOpenUnauthorizedModal,
            setOpenSnackbar
        );
    }

    const handleBuyPlaylist = () => {

        handleAddToCart(
            dispatch,
            router,
            cart,
            audio.playlist_id,
            setErrorMessage,
            setOpenSnackbar
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                ...(openAudioDetail && { display: 'none' })
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    minHeight: isSm ? '272px' : '390px',
                    ...(isSm ? flexStyle('flext-start', 'flex-start') : flexStyle('flext-start', 'center')),
                    p: isSm ? '25px 18px 25px 17px' : '50px 50px 50px 160px',
                    boxSizing: 'border-box',
                    mb: isSm ? '16px' : '40px',
                    position: 'relative',
                    zIndex: 1,
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
                        opacity: 0.4,
                        zIndex: -1
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'flex-start'),
                        columnGap: isSm ? '24px' : '48px',
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
                                borderRadius: '4px',
                                border: `${isSm ? 5 : 6}px solid ${COLORS.bg3}`
                            }}
                            alt={`image ${channel?.name}`}
                            src={channel?.avatar?.thumb_url}
                        />
                    </Box>
                    <Box
                        sx={{
                            height: '100%',
                            width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 210px)',
                            ...(isSm ? flexStyle('flex-start', 'flex-start') : flexStyle('space-around', 'flex-start')),
                            ...(isSm && { flexDirection: 'column', rowGap: '20px' }),
                            columnGap: '10%'
                        }}
                    >
                        <Box
                            sx={{
                                ...flexStyle('flex-start', 'center'),
                                flexDirection: 'column',
                                ...(isSm && { width: '100%' })
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
                                        color: COLORS.white,
                                        cursor: 'text'
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
                                            ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                            color: COLORS.contentIcon,
                                            cursor: 'text'
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
                                        color: COLORS.VZ_Text_content,
                                        cursor: 'text'
                                    }}
                                >{channel?.description}</Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                ...(isSm ? flexStyle('flex-start', 'center') : flexStyle('flex-end', 'center')),
                                columnGap: '10%',
                                ...(isSm && { width: '100%' })
                            }}
                        >
                            <IconButton
                                onClick={handleOpenShareModal}
                                sx={{
                                    p: 0
                                }}
                            >
                                <Share bgfill='none' fill='none' stroke={COLORS.contentIcon} />
                            </IconButton>
                            <ShareModal url={url} isSm={isSm} open={openShareModal} setOpen={setOpenShareModal}></ShareModal>
                            <Button
                                onClick={handleBookmark}
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                    color: COLORS.white,
                                    borderRadius: '22px',
                                    height: isSm ? '28px' : '48px',
                                    width: isSm ? '94px' : '170px',
                                    textTransform: 'none',
                                    bgcolor: channel?.is_bookmark ? COLORS.bg3 : COLORS.main,
                                    whiteSpace: 'nowrap',
                                    p: '4px 14px',
                                    '& .MuiButton-startIcon': {
                                        mr: '4px'
                                    },
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
                    columnGap: '32px',
                    mb: isSm ? 0 : '80px',
                    ...(!isSm && {
                        maxHeight: '749px'
                    })
                }}
            >
                <Box
                    sx={{
                        width: isSm ? '100%' : 'calc(40% - 16px)',
                        bgcolor: COLORS.bg2,
                        borderRadius: '10px',
                        overflowY: isSm ? 'auto' : 'hidden',
                        scrollbarGutter: 'stable',
                        '::-webkit-scrollbar': {
                            width: '4px'
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
                    <Box
                        sx={{
                            p: isSm ? '26px 16px 40px 16px' : '26px 39px 31px 39px',
                            boxSizing: 'border-box',
                            ...(isSm && {
                                maxHeight: '724px'
                            }),
                            overflowY: 'scroll',
                            scrollbarGutter: 'stable',
                            '::-webkit-scrollbar': {
                                width: '4px'
                            },

                            '::-webkit-scrollbar-track': {
                                borderRadius: '5px',
                            },

                            '::-webkit-scrollbar-thumb': {
                                background: COLORS.bg3,
                                borderRadius: '5px'
                            }
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
                                        promotion={i?.promotion}
                                        children={<PlaylistAudioCount isSm={isSm}
                                            audioCount={i?.playlist_counter?.audios_count}
                                        />}
                                    />
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: isSm ? '100%' : 'calc(60% - 16px)',
                        bgcolor: COLORS.bg2,
                        borderRadius: '10px',
                        overflowY: isSm ? 'auto' : 'hidden',
                        scrollbarGutter: 'stable',
                        '::-webkit-scrollbar': {
                            width: '4px'
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
                    <Box
                        sx={{
                            p: isSm ? '26px 16px 16px 16px' : '26px 32px 16px 32px',
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
                            <List
                                sx={{
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                {audios.map((i, idx) => {
                                    return (
                                        <ListItem
                                            sx={{
                                                paddingLeft: 0,
                                                paddingRight: 0,
                                                borderTop: `.5px solid ${COLORS.placeHolder}`,
                                                height: '72px'
                                            }}
                                            onClick={() => { handlePlayChannelAudio(i) }}
                                            key={i?.id}
                                            secondaryAction={
                                                <Typography
                                                    sx={{
                                                        ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2),
                                                        color: COLORS.bg4
                                                    }}
                                                >{formatDuration(i?.duration)}</Typography>
                                            }
                                        >
                                            <ListItemButton role={undefined} onClick={() => (1)} dense>
                                                <Typography
                                                    sx={{
                                                        ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                        color: COLORS.white,
                                                        mr: '14px'
                                                    }}
                                                >{idx + 1}</Typography>
                                                <ListItemText
                                                    sx={{
                                                        'span': {
                                                            ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                            color: COLORS.white,
                                                            display: '-webkit-box',
                                                            textOverflow: 'ellipsis',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            mr: '20px'
                                                        }
                                                    }}
                                                    id={`label-${i?.id}`} primary={i?.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                                {
                                    hasLoadMoreAudio && (
                                        <Button
                                            onClick={handleLoadMoreAudio}
                                            sx={{
                                                textTransform: 'none',
                                                ...TEXT_STYLE.title2,
                                                color: COLORS.white,
                                                bgcolor: COLORS.main,
                                                width: '170px',
                                                height: '40px',
                                                borderRadius: '4px',
                                                mt: '10px',
                                                ':hover': {
                                                    bgcolor: COLORS.main
                                                }
                                            }}
                                        >
                                            Tải thêm
                                        </Button>
                                    )
                                }
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
            {!isSm && (
                <Divider
                    sx={{
                        bgcolor: COLORS.blackStroker,
                        m: '0 48px'
                    }}
                />
            )}
            <PlayAudioDialog
                isSm={isSm}
                openUnauthorizedModal={openUnauthorizedModal}
                openUpdateRequiredModal={openUpdateRequiredModal}
                errorMessage={errorMessage}
                setOpenUnauthorizedModal={setOpenUnauthorizedModal}
                setOpenUpdateRequiredModal={setOpenUpdateRequiredModal}
                handleBuyPlaylist={handleBuyPlaylist}
            />
        </Box>
    )
}