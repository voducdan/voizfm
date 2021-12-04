// import react
import { useState } from 'react';

// import redux
import { useSelector } from 'react-redux';
import { selectAudioData } from '../../redux/audio';


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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FilterListIcon from '@mui/icons-material/FilterList';

// import others components
import Control from './Control';


// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';


export default function PlayBar() {

    const windowSize = useWindowSize();
    const [volume, setVolume] = useState(40);

    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const audioData = useSelector(selectAudioData);
    // const audioData = {}
    return (
        <Box
            sx={{
                bgcolor: COLORS.bg1,
                ...flexStyle('center', 'center'),
                columnGap: '3%',
                boxSizing: 'border-box',
                padding: '0 50px',
                width: '100%',
                zIndex: 1201,
                position: 'fixed',
                bottom: 0,
                borderTop: `1px solid ${COLORS.blackStroker}`,
                height: '100px'
            }}
        >
            <Box
                sx={{
                    width: '30%',
                    ...flexStyle('flex-start', 'center'),
                    columnGap: '15px'
                }}
            >
                <Avatar
                    sx={{ width: isSm ? '65px' : '65px', height: isSm ? '65px' : '65px' }}
                    alt="audio avt"
                    src={audioData?.avatar?.thumb_url}
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
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                marginBottom: '8px'
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
                    <FavoriteBorderIcon sx={{ color: COLORS.contentIcon }} />
                </Box>
            </Box>
            <Box
                sx={{
                    width: '40%'
                }}
            >
                <Control />
            </Box>
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
        </Box>
    )
}