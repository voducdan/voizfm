// import react
import { useState, useEffect } from 'react';

// import next link
import Link from 'next/link';

// import MUI component
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Avatar,
    Button,
    Snackbar,
    Alert
} from '@mui/material';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail'
import Thumbnail from '../../components/Thumbnail/Thumbnail';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

SwiperCore.use([Navigation]);

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

const ChannelBookmark = (props) => {
    const { data, isSm, handleBookmarkChannel } = props;
    const playlists = data.playlists;
    return (
        <Box
            sx={{
                width: '100%'
            }}
        >
            <Box
                sx={{
                    ...flexStyle('space-between', 'flex-start'),
                    width: '100%',
                    ...(isSm && { columnGap: '8px' })
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: isSm ? '8px' : '16px'
                    }}
                >
                    <Avatar
                        sx={{
                            width: isSm ? '32px' : '40px',
                            height: isSm ? '32px' : '40px'
                        }}
                        alt="img"
                        src={data.avatar.thumb_url}
                    />
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                            color: COLORS.white
                        }}
                    >
                        {data.name}
                    </Typography>
                    <ChevronRightIcon sx={{ color: COLORS.white }} />
                </Box>
                <Button
                    onClick={() => { handleBookmarkChannel(data.id) }}
                    sx={{
                        ...(isSm ? TEXT_STYLE.title3 : TEXT_STYLE.title1),
                        ...(isSm && { whiteSpace: 'nowrap' }),
                        color: COLORS.white,
                        borderRadius: '22px',
                        height: isSm ? '28px' : '48px',
                        width: 'max-content',
                        textTransform: 'none',
                        bgcolor: data['is_bookmark'] ? COLORS.bg3 : COLORS.main,
                        pl: '14px',
                        pr: '14px',
                        ':hover': {
                            bgcolor: data['is_bookmark'] ? COLORS.bg3 : COLORS.main
                        }
                    }}
                    startIcon={data['is_bookmark'] ? <CheckIcon /> : <AddIcon />}
                >{data['is_bookmark'] ? 'H???y theo d??i' : 'Theo d??i'}</Button>
            </Box>

            <Swiper slidesPerView={isSm ? 2.5 : 5} spaceBetween={isSm ? 8 : 22} style={{ marginTop: '10px' }}>
                {playlists.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Link
                            href={`/playlists/${item.id}`}
                            style={{
                                height: isSm ? '145px' : '186px'
                            }}
                        >
                            <a>
                                <Thumbnail
                                    style={{ width: '100%', height: '100%', borderRadius: '4px' }}
                                    avtSrc={item.avatar.thumb_url}
                                    alt={`images ${item.id}`}
                                />
                            </a>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}

const tabStyle = () => ({
    '&.MuiTab-root': {
        ...TEXT_STYLE.title1,
        color: COLORS.contentIcon,
        textTransform: 'none'
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

export default function PlaylistBookmark() {
    const api = new API();
    const windowSize = useWindowSize();
    const pageLimit = 10;
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [playlistBookmarks, setPlaylistBookmarks] = useState([]);
    const [channelBookmarks, setChannelBookmarks] = useState([]);
    const [playlistPage, setPlaylistPage] = useState(0);
    const [channelPage, setChannelPage] = useState(0);
    const [value, setValue] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function fetchPlaylistBookmarks() {
            const res = await api.getPlaylistBookmarks(playlistPage, pageLimit);
            const data = await res.data.data;
            data.forEach(i => i['is_bookmark'] = true);
            setPlaylistBookmarks(data)
        }
        async function fetchChannelBookmarks() {
            const res = await api.getChannelBookmarks(channelPage, pageLimit);
            const data = await res.data.data;
            data.forEach(i => i['is_bookmark'] = true);
            setChannelBookmarks(data)
        }

        fetchChannelBookmarks()
        fetchPlaylistBookmarks()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleBookmark = (id) => {
        async function bookmarkPlaylist() {
            try {
                const res = await api.bookmarkPlaylist(id);
                const data = await res.data;
                if (data.error) {
                    setOpenSnackbar(true);
                    setErrorMessage('????nh d???u playlist kh??ng th??nh c??ng!');
                    return;
                }
                const playlistBookmarksTmp = [...playlistBookmarks];
                const playlistId = playlistBookmarksTmp.findIndex(i => i.id === id);
                playlistBookmarksTmp[playlistId]['is_bookmark'] = !playlistBookmarksTmp[playlistId]['is_bookmark'];
                setPlaylistBookmarks([...playlistBookmarksTmp]);
            }
            catch (err) {
                setErrorMessage('????nh d???u playlist kh??ng th??nh c??ng!')
                setOpenSnackbar(true);
                console.log(err);
            }
        }

        bookmarkPlaylist();
    }

    const handleBookmarkChannel = (id) => {
        async function bookmarkChannel() {
            try {
                const res = await api.bookmarkChannel(id);
                const data = await res.data;
                if (data.error) {
                    setOpenSnackbar(true);
                    setErrorMessage('????nh d???u k??nh kh??ng th??nh c??ng!');
                    return;
                }
                const channelBookmarksTmp = [...channelBookmarks];
                const channelId = channelBookmarksTmp.findIndex(i => i.id === id);
                channelBookmarksTmp[channelId]['is_bookmark'] = !channelBookmarksTmp[channelId]['is_bookmark'];
                setChannelBookmarks([...channelBookmarksTmp]);
            }
            catch (err) {
                setErrorMessage('????nh d???u k??nh kh??ng th??nh c??ng!')
                setOpenSnackbar(true);
                console.log(err);
            }
        }

        bookmarkChannel();
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    textAlign: 'left',
                    mb: '32px'
                }}
            >????nh d???u</Typography>
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
                    <Tab sx={tabStyle} label="K??nh" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} isSm={isSm}>
                {
                    playlistBookmarks.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            id={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.author_string}
                            isBookmark={i.is_bookmark}
                            hasBookmark={true}
                            handleBookmark={handleBookmark}
                            children={<PlaylistAudioCount isSm={isSm} audioCount={i?.playlist_counter?.audios_count} />}
                        />
                    ))
                }
            </TabPanel>
            <TabPanel value={value} index={1} isSm={isSm}>
                {
                    channelBookmarks.map(i => (
                        <ChannelBookmark key={i.id} isSm={isSm} data={i} handleBookmarkChannel={handleBookmarkChannel} />
                    ))
                }
            </TabPanel>
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