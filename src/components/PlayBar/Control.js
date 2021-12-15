import { useState, useEffect } from 'react';

// import redux
import { useDispatch } from 'react-redux';
import { togglePlayAudio } from '../../redux/playAudio';


import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { COLORS, TEXT_STYLE } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle';
import { Loop, Clock } from '../Icons';

const WallPaper = styled('div')({
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden'
});

const Widget = styled('div')(({ theme }) => ({
    width: '100%',
    margin: 'auto',
    position: 'relative',
    ...flexStyle('center', 'center'),
    flexDirection: 'column',
    rowGap: '20px'
}));


const TinyText = styled(Typography)({
    ...TEXT_STYLE.content2,
    color: COLORS.white
});

export default function Control(props) {

    const { audioData } = props
    const audioUrl = 'https://assets.coderrocketfuel.com/pomodoro-times-up.mp3';

    // audioData.meta_data.remaining_minutes
    const remainingTime = 19;

    const theme = useTheme();
    const dispatch = useDispatch();
    const [position, setPosition] = useState(audioData.duration - remainingTime);
    const [paused, setPaused] = useState(true);
    const [audio] = useState(new Audio(audioUrl));

    useEffect(() => {
        !paused ? audio.play() : audio.pause();
    }, [paused]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPaused(true));
        // audio.addEventListener('timeupdate', (e) => {
        //     const currentTime = e.target.currentTime;
        //     setPosition(currentTime)
        // });
        return () => {
            audio.removeEventListener('ended', () => setPaused(true));
        };
    }, []);

    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
    }

    const onPlayClick = () => {
        setPaused(!paused)
        dispatch(togglePlayAudio())
    }

    const mainIconColor = COLORS.white

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Widget>
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '36px',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            textAlign: 'center'
                        }}
                    >
                        <Loop fill={COLORS.bg4} bgcolor='none' />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.caption10Regular,
                                color: COLORS.contentIcon,
                                whiteSpace: 'nowrap',
                                marginTop: '9px'
                            }}
                        >Lặp lại 1 bài</Typography>
                    </Box>
                    <IconButton aria-label="previous song">
                        <SkipPreviousIcon sx={{ width: '24px', height: '24px' }} htmlColor={mainIconColor} />
                    </IconButton>
                    <IconButton
                        sx={{
                            border: `1px solid ${COLORS.white}`
                        }}
                        aria-label={paused ? 'play' : 'pause'}
                        onClick={onPlayClick}
                    >
                        {paused ? (
                            <PlayArrowIcon
                                sx={{ width: '24px', height: '24px' }}
                                htmlColor={mainIconColor}
                            />
                        ) : (
                            <PauseIcon sx={{ width: '24px', height: '24px' }} htmlColor={mainIconColor} />
                        )}
                    </IconButton>
                    <IconButton aria-label="next song">
                        <SkipNextIcon sx={{ width: '24px', height: '24px' }} htmlColor={mainIconColor} />
                    </IconButton>
                    <Box
                        sx={{
                            textAlign: 'center'
                        }}
                    >
                        <Clock fill={COLORS.bg4} bgcolor='none' />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.caption10Regular,
                                color: COLORS.contentIcon,
                                whiteSpace: 'nowrap',
                                marginTop: '4px'
                            }}
                        >Hẹn giờ</Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '10px',
                        width: '100%',
                        mt: -2,
                    }}
                >
                    <TinyText>{formatDuration(position)}</TinyText>
                    <Slider
                        aria-label="time-indicator"
                        size="small"
                        value={position}
                        min={0}
                        step={1}
                        max={audioData?.duration}
                        onChange={(_, value) => setPosition(value)}
                        sx={{
                            height: 3,
                            color: '#CFD1E9',
                            '& .MuiSlider-track': {
                                color: '#754ADA'
                            },
                            '& .MuiSlider-thumb': {
                                width: 12,
                                height: 12,
                                color: COLORS.white,
                                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                '&:before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                                        ? 'rgb(255 255 255 / 16%)'
                                        : 'rgb(0 0 0 / 16%)'
                                        }`,
                                },
                                '&.Mui-active': {
                                    width: 15,
                                    height: 15,
                                },
                            },
                            '& .MuiSlider-rail': {
                                opacity: 1,
                            },
                        }}
                    />
                    <TinyText>-{formatDuration(audioData?.duration - position)}</TinyText>
                </Box>
            </Widget>
            <WallPaper />
        </Box>
    )
}