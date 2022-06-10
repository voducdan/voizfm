// import react
import { useState, useEffect } from 'react';

// import redux
import { useDispatch } from 'react-redux';

// import MUI component
import {
    Box,
    Tabs,
    Tab,
    Typography
} from '@mui/material';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail';
import {
    GraphicEQ,
    AccessTime
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatDuration from '../../utils/formatDuration';

// import service
import API from '../../services/api';

function TabPanel(props) {
    const { children, value, index, isSm } = props;
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Box
                    sx={{
                        p: '40px 0',
                        ...flexStyle('flex-start', 'center'),
                        columnGap: '10%',
                        rowGap: isSm ? '18px' : '40px',
                        flexWrap: 'wrap'
                    }}
                >
                    {children}
                </Box>
            )}
        </Box>
    );
}

const PlaylistAudioCount = (props) => {
    const { audioCount, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: '6px'
            }}
        >
            <GraphicEQ />
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

const AudioDuration = (props) => {
    const { duration, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: '6px'
            }}
        >
            <AccessTime />
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                    color: COLORS.contentIcon
                }}
            >
                {formatDuration(duration)}
            </Typography>
        </Box>
    )
}

const tabStyle = () => ({
    '&.MuiTab-root': {
        ...TEXT_STYLE.title1,
        color: COLORS.contentIcon,
        textTransform: 'none',
        alignItems: 'flex-start',
        p: 0,
        minWidth: 0,
        mr: '16px'
    },
    '&.Mui-selected': {
        color: COLORS.white
    }
})


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function PlaylistHistory() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [playlistHistories, setPlaylistHistories] = useState([]);
    const [audiotHistories, setAudioHistories] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        async function fetchPlaylistHistories() {
            try {
                const res = await api.getPlaylistHistory();
                const data = await res.data.data;
                setPlaylistHistories(data);
            }
            catch (err) {
                console.log(err)
            }
        }
        async function fetchAudioHistories() {
            try {
                const res = await api.getAudioHistory();
                const data = await res.data.data;
                setAudioHistories(data);
            }
            catch (err) {
                console.log(err)
            }
        }

        fetchAudioHistories()
        fetchPlaylistHistories()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    textAlign: 'left',
                    mb: '32px'
                }}
            >Lịch sử nghe</Typography>
            <Box sx={{ borderBottom: 1, borderColor: COLORS.blackStroker }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs"
                    sx={{
                        '&.MuiTabs-indicator': {
                            bgcolor: COLORS.main
                        }
                    }}
                >
                    <Tab sx={tabStyle} label="Playlist" {...a11yProps(0)} />
                    <Tab sx={tabStyle} label="Audio" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} isSm={isSm}>
                {
                    playlistHistories.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            id={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.authors}
                            promotion={i?.promotion}
                            children={<PlaylistAudioCount
                                isSm={isSm}
                                promotion={i?.promotion}
                                audioCount={i?.playlist_counter?.audios_count} />}
                        />
                    ))
                }
            </TabPanel>
            <TabPanel value={value} index={1} isSm={isSm}>
                {
                    audiotHistories.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            id={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.author?.name}
                            hasBookmark={false}
                            promotion={i?.promotion}
                            isAudio={true}
                            playlistId={i?.playlist?.id}
                            children={<AudioDuration isSm={isSm}
                                duration={i?.duration} />}
                        />
                    ))
                }
            </TabPanel>
        </Box>
    )
}