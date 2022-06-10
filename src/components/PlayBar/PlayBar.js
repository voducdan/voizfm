// import react
import { useState, useRef, useEffect } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import reducer, actions
import { setOpenAudioDetail, selectOpenExpandMoreAudio, setOpenExpandMoreAudio } from '../../redux/playAudio';
import { selectCart } from '../../redux/payment';
import { selectAudioData } from '../../redux/audio';

// import next router
import { useRouter } from 'next/router';

// import MUI components
import {
    Box,
    Avatar,
    Typography,
    Button,
    Slider,
    Stack,
    Divider,
    Snackbar,
    Alert,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// import others components
import Control from './Control';
import AudioList from '../../components/AudioPlay/AudioListModals';
import handleAddToCart from '../../components/Shared/handleAddToCart';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import services
import API from '../../services/api';

export default function PlayBar() {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const audio = useRef(null);
    const router = useRouter()
    const openExpandMoreAudio = useSelector(selectOpenExpandMoreAudio);
    const audioData = useSelector(selectAudioData);
    const cart = useSelector(selectCart);
    const [volume, setVolume] = useState(60);
    const [anchorAudioList, setAnchorAudioList] = useState(null);
    const [isLiked, setIsLiked] = useState(audioData?.meta_data?.is_liked);
    const [audiosList, setAudiosList] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [nextAudioId, setNextAudioId] = useState(undefined);
    const [prevAudioId, setPrevAudioId] = useState(undefined);
    const [openUpdateRequiredModal, setOpenUpdateRequiredModal] = useState(false);
    const [openUnauthorizedModal, setOpenUnauthorizedModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        function compare(a, b) {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            return 0;
        }

        async function fetchPlaylistAudios() {
            const res = await api.getPlaylistAudios(audioData?.playlist?.id);
            const data = res.data.data;
            const order = audioData?.playlist?.order || 'asc';
            data.sort(compare);
            if (order === 'desc') {
                data.reverse();
            }
            setAudiosList(data);
        };
        audio.current.volume = volume / 100;
        if (audioData?.playlist?.id) {
            fetchPlaylistAudios();
        }
    }, [audioData]);

    useEffect(() => {
        if (audiosList.length > 0) {
            assignAudioId();
        }
    }, [router.asPath, audiosList]);

    useEffect(() => {
        audio.current.volume = volume / 100;
    }, [volume]);

    const assignAudioId = () => {
        if (audiosList.length === 1) {
            setNextAudioId(null);
            setPrevAudioId(null);
            return;
        }
        const audioIdx = audiosList.findIndex(i => i.id === Number(audioData.id));
        const nextIdx = audioIdx + 1;
        const prevIdx = audioIdx - 1;

        const nextId = nextIdx < audiosList.length ? audiosList[nextIdx].id : null;
        const prevId = prevIdx >= 0 ? audiosList[prevIdx].id : null;
        setNextAudioId(nextId);
        setPrevAudioId(prevId);
    }

    const openAudioList = (event) => {
        setAnchorAudioList(event.currentTarget);
    }

    const onCloseAudioList = () => {
        setAnchorAudioList(null);
    }

    const handleLikeAudio = () => {
        async function likeAudio() {
            try {
                const audioId = audioData.id;
                const res = await api.likeAudio(audioId);
                const data = await res.data;
                if (!data.error) {
                    setIsLiked(data.data['is_liked']);
                }
            }
            catch (err) {
                console.log(err);
                setOpenSnackbar(true);
            }
        }

        likeAudio();
    }

    const handleChangeVolumn = (value) => {
        setVolume(value);
        audio.current.volume = value / 100;
    }

    const handleExpandAudioDetail = () => {
        dispatch(setOpenAudioDetail(true));
        dispatch(setOpenExpandMoreAudio(false));
    }

    const handleBuyPlaylist = () => {
        handleAddToCart(
            dispatch,
            router,
            cart,
            audioData?.playlist,
            true,
            setErrorMessage,
            setOpenSnackbar
        );
    }

    return (
        <Box
            onClick={handleExpandAudioDetail}
            id='play-audio-bar'
            sx={{
                bgcolor: COLORS.bg1,
                ...flexStyle('center', 'center'),
                columnGap: '3%',
                boxSizing: 'border-box',
                padding: isSm ? '24px 25px' : 0,
                width: '100%',
                zIndex: 1201,
                position: 'fixed',
                bottom: 0,
                borderTop: `1px solid ${COLORS.blackStroker}`,
                height: isSm ? 'auto' : '100px',
                cursor: 'pointer',
                ...(isSm && { flexDirection: 'column-reverse', rowGap: '16px' })
            }}
        >
            {
                openExpandMoreAudio && (
                    <Box
                        onClick={handleExpandAudioDetail}
                        sx={{
                            position: 'absolute',
                            width: '56px',
                            height: '28px',
                            right: isSm ? '24px' : '48px',
                            top: '-30px',
                            ...flexStyle('center', 'center'),
                            p: 0,
                            borderTopLeftRadius: '29px',
                            borderTopRightRadius: '29px',
                            borderTop: `1px solid ${COLORS.blackStroker}`,
                            color: COLORS.contentIcon,
                            bgcolor: COLORS.bg1,
                            cursor: 'pointer'
                        }}
                    >
                        <ExpandLessIcon />
                    </Box>
                )
            }
            <audio
                id='audio'
                hidden
                preload="auto"
                ref={audio}
            />
            {
                isSm && (
                    <Button
                        sx={{
                            bgcolor: COLORS.bg2,
                            ...TEXT_STYLE.content2,
                            color: COLORS.contentIcon,
                            textTransform: 'none',
                            width: isSm ? '100%' : '157px',
                            ...(!isSm && { maxWidth: '50%' }),
                            height: '36px',
                            borderRadius: '4px'
                        }}
                        startIcon={<FilterListIcon />}
                        onClick={openAudioList}
                    >
                        Danh sách audio
                    </Button>
                )
            }
            <Box
                sx={{
                    width: isSm ? '100%' : '30%',
                    ...flexStyle('flex-start', 'center'),
                    columnGap: '15px'
                }}
            >
                <Avatar
                    sx={{ width: isSm ? '65px' : '65px', height: isSm ? '65px' : '65px' }}
                    alt="audio avt"
                    src={audioData?.avatar?.original_url || audioData?.playlist?.avatar?.original_url}
                />
                <Box
                    sx={{
                        ...flexStyle('center', 'flex-start'),
                        columnGap: '28px'
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                color: COLORS.white,
                                marginBottom: `${isSm ? 4 : 8}px`,
                                display: '-webkit-box',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {audioData?.name}
                        </Typography>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: COLORS.contentIcon
                            }}
                        >
                            Tác giả: {audioData?.author?.name}
                        </Typography>
                    </Box>
                    {
                        isLiked && (
                            <FavoriteIcon
                                onClick={handleLikeAudio}
                                sx={{
                                    color: COLORS.main
                                }}
                            />
                        )
                    }
                    {
                        !isLiked && (
                            <FavoriteBorderIcon
                                sx={{
                                    color: COLORS.contentIcon
                                }}
                                onClick={handleLikeAudio}
                            />
                        )
                    }
                </Box>
            </Box>
            {isSm && (<Divider sx={{ borderColor: COLORS.blackStroker, margin: '5px 0', width: '100%', borderWidth: '1px' }} />)}
            {(Object.keys(audioData).length > 0 && nextAudioId !== undefined && prevAudioId !== undefined) && (<Box
                sx={{
                    width: isSm ? '100%' : '40%',
                }}
            >
                <Control
                    audio={audio}
                    nextAudioId={nextAudioId}
                    prevAudioId={prevAudioId}
                    isSm={isSm}
                />
            </Box>)
            }
            {
                !isSm && (
                    <Box
                        sx={{
                            width: '30%',
                            ...flexStyle('center', 'flex-end')
                        }}
                    >
                        <Button
                            sx={{
                                bgcolor: COLORS.bg2,
                                ...TEXT_STYLE.content2,
                                color: COLORS.contentIcon,
                                textTransform: 'none',
                                width: '157px',
                                maxWidth: '50%',
                                height: '36px',
                                borderRadius: '4px'
                            }}
                            startIcon={<FilterListIcon />}
                            onClick={openAudioList}
                        >
                            Danh sách audio
                        </Button>

                        <Divider sx={{ color: COLORS.blackStroker, margin: '0 24px' }} orientation="vertical" flexItem />
                        <Stack spacing={2} direction="row" sx={{ mb: 1, width: '50%', }} alignItems="center" justifyContent="flex-start">
                            {volume > 0 && (<VolumeUp onClick={() => { setVolume(0) }} sx={{ color: COLORS.contentIcon }} />)}
                            {volume === 0 && (<VolumeOffIcon onClick={() => { setVolume(60) }} sx={{ color: COLORS.contentIcon }} />)}
                            <Slider
                                sx={{
                                    height: 2,
                                    width: '100px',
                                    maxWidth: '100%',
                                    color: COLORS.blackStroker,
                                    '& .MuiSlider-track': {
                                        color: COLORS.white
                                    },
                                    '& .MuiSlider-thumb': {
                                        width: 12,
                                        height: 12,
                                        color: COLORS.white,
                                        '&.Mui-active': {
                                            width: 15,
                                            height: 15,
                                        },
                                    },
                                    '& .MuiSlider-rail': {
                                        opacity: 1,
                                    },
                                }}
                                aria-label="Volume"
                                value={volume}
                                onChange={(_, value) => handleChangeVolumn(value)}
                            />
                        </Stack>
                    </Box>
                )
            }
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => { setOpenSnackbar(false) }}
            >
                <Alert onClose={() => { setOpenSnackbar(false) }} severity="error" sx={{ width: '100%' }}>
                    Thích audio không thành công, vui lòng thử lại sau!
                </Alert>
            </Snackbar>
            <AudioList
                anchorAudioList={anchorAudioList}
                dispatch={dispatch}
                onCloseAudioList={onCloseAudioList}
                playlistId={audioData?.playlist?.id}
                promotion={audioData?.playlist?.promotion}
                audioId={Number(audioData.id)}
                audiosList={audiosList}
                setErrorMessage={setErrorMessage}
                setOpenUpdateRequiredModal={setOpenUpdateRequiredModal}
                setOpenUnauthorizedModal={setOpenUnauthorizedModal}
                setOpenSnackbar={setOpenSnackbar}
            />
            <Dialog
                open={openUnauthorizedModal}
                onClose={() => { setOpenUnauthorizedModal(false) }}
                sx={{
                    '& .MuiPaper-root': {
                        width: isSm ? '95%' : '512px',
                        bgcolor: COLORS.bg1,
                        m: 0,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <DialogContent
                    sx={{
                        p: 0
                    }}
                >
                    <DialogContentText
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            textAlign: 'center',
                            mb: isSm ? '24px' : '32px',
                            p: 0
                        }}
                    >
                        Voiz FM
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            whiteSpace: 'pre-line',
                            mb: '32px'
                        }}
                    >
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center')
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            flexDirection: 'column',
                            rowGap: '24px'
                        }}
                    >
                        <Button
                            onClick={handleBuyPlaylist}
                            sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                borderRadius: '8px',
                                width: isSm ? '168px' : '192px',
                                height: '48px',
                                bgcolor: COLORS.main
                            }}
                            autoFocus
                        >
                            Mua lẻ sách
                        </Button>
                        <Button
                            onClick={() => { setOpenUnauthorizedModal(false) }}
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                textTransform: 'none'
                            }}
                        >
                            Bỏ qua
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openUpdateRequiredModal}
                onClose={() => { setOpenUpdateRequiredModal(false) }}
                sx={{
                    '& .MuiPaper-root': {
                        width: isSm ? '95%' : '512px',
                        bgcolor: COLORS.bg1,
                        m: 0,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('center', 'center'),
                        mb: isSm ? '24px' : '32px'
                    }}
                >
                    <img
                        style={{
                            width: isSm ? '134px' : '108px',
                            height: isSm ? '134px' : '108px'
                        }}
                        src='/images/upgrade.png'
                        alt='upgrade img'
                    />
                </Box>
                <DialogContent
                    sx={{
                        p: 0
                    }}
                >
                    <DialogContentText
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            textAlign: 'center',
                            mb: '24px',
                            p: 0
                        }}
                    >
                        Nâng cấp ngay
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            whiteSpace: 'pre-line',
                            mb: '32px'
                        }}
                    >
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center')
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            flexDirection: 'column',
                            rowGap: '24px',
                            width: '100%'
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                ...flexStyle('center', 'center'),
                                columnGap: '16px'
                            }}
                        >
                            <Button
                                onClick={handleBuyPlaylist}
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    width: isSm ? '168px' : '192px',
                                    height: '48px',
                                    bgcolor: COLORS.bg1,
                                    border: `1px solid ${COLORS.blackStroker}`,
                                    width: '50%'
                                }}
                                autoFocus
                            >
                                Mua lẻ sách
                            </Button>
                            <Button
                                onClick={() => { router.push('/up-vip') }}
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    width: isSm ? '168px' : '192px',
                                    height: '48px',
                                    bgcolor: COLORS.main,
                                    width: '50%'
                                }}
                                autoFocus
                            >
                                Đăng ký gói
                            </Button>
                        </Box>
                        <Button
                            onClick={() => { setOpenUpdateRequiredModal(false) }}
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                textTransform: 'none'
                            }}
                        >
                            Bỏ qua
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    )
}