// import react
import { useState } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';
import { selectAudioData, setAudioData } from '../../redux/audio';

// import MUI components
import {
    Box,
    Avatar,
    Typography,
    Button,
    Slider,
    Stack,
    Divider
} from '@mui/material';
import VolumeUp from '@mui/icons-material/VolumeUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterListIcon from '@mui/icons-material/FilterList';

// import others components
import Control from './Control';
import AudioList from '../../components/AudioPlay/AudioListModals';

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
    const audioData = useSelector(selectAudioData);
    const [volume, setVolume] = useState(40);
    const [anchorAudioList, setAnchorAudioList] = useState(null);
    const [isLiked, setIsLiked] = useState(audioData?.meta_data?.is_liked);
    const dispatch = useDispatch();
    const openAudioList = (event) => {
        setAnchorAudioList(event.currentTarget);
    }

    const onCloseAudioList = () => {
        setAnchorAudioList(null);
    }

    const handleLikeAudio = () => {
        async function likeAudio() {
            const audioId = audioData.id;
            const res = await api.likeAudio(audioId);
            const data = await res.data;
            if (!data.error) {
                setIsLiked(data.data['is_liked']);
            }
        }

        likeAudio();
    }

    return (
        <Box
            id='play-audio-bar'
            sx={{
                bgcolor: COLORS.bg1,
                ...flexStyle('center', 'center'),
                columnGap: '3%',
                boxSizing: 'border-box',
                padding: `${isSm ? 24 : 0}px 0`,
                width: '100%',
                zIndex: 1201,
                position: 'fixed',
                bottom: 0,
                borderTop: `1px solid ${COLORS.blackStroker}`,
                height: isSm ? 'auto' : '100px',
                ...(isSm && { flexDirection: 'column-reverse', rowGap: '16px' })
            }}
        >
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
                    src={audioData?.playlist?.avatar?.thumb_url}
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
                            {audioData?.playlist?.name}
                        </Typography>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: COLORS.contentIcon
                            }}
                        >
                            Tác giả: {audioData?.playlist?.author_string}
                        </Typography>
                    </Box>
                    <FavoriteIcon
                        onClick={handleLikeAudio}
                        sx={{
                            color: isLiked ? COLORS.main : COLORS.contentIcon
                        }}
                    />
                </Box>
            </Box>
            {isSm && (<Divider sx={{ borderColor: COLORS.blackStroker, margin: '5px 0', width: '100%', borderWidth: '1px' }} />)}
            {Object.keys(audioData).length > 0 && (<Box
                sx={{
                    width: isSm ? '100%' : '40%',
                }}
            >
                <Control audioData={audioData} />
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
                            <VolumeUp sx={{ color: COLORS.contentIcon }} />
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
                                aria-label="Volume" value={volume} onChange={(_, value) => setVolume(value)} />
                        </Stack>
                    </Box>
                )
            }
            <AudioList anchorAudioList={anchorAudioList} onCloseAudioList={onCloseAudioList} playlistId={audioData?.playlist?.id} audioId={audioData?.id} />
        </Box>
    )
}