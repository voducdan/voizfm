// import react
import { useState, useEffect } from 'react';

// import MUI component
import {
    Box,
    Typography,
    Tabs,
    Tab
} from '@mui/material';
// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail';
import VipComboItem from '../../components/Shared/VipComboItem';
import {
    GraphicEQ
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

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
};

export default function PlaylistOrder() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [playlistOrders, setPlaylistOrders] = useState([]);
    const [comboOrders, setComboOrders] = useState([]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        async function fetchPlaylistOrders() {
            try {
                const res = await api.getPlaylistOrders();
                const data = await res.data.data;
                setPlaylistOrders(data);
            }
            catch (err) {
                console.log(err)
            }
        }
        async function fetchComboOrders() {
            try {
                const res = await api.getOrderedCombo();
                const data = await res.data.data;
                setComboOrders(data);
            }
            catch (err) {
                console.log(err)
            }
        }

        fetchPlaylistOrders();
        fetchComboOrders();
    }, []);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    textAlign: 'left',
                    mb: '32px'
                }}
            >Đã mua</Typography>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor:
                        COLORS.blackStroker
                }}>
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
                    <Tab sx={tabStyle} label="Gói combo" {...a11yProps(1)} />
                    <Tab sx={tabStyle} label="Playlist" {...a11yProps(0)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} isSm={isSm}>
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: '16px',
                        rowGap: '16px',
                        flexWrap: 'wrap'
                    }}
                >
                    {
                        comboOrders.map(i => (
                            <Box
                                sx={{
                                    width: 'calc(100% / 3 - 11px)'
                                }}
                            >
                                <VipComboItem
                                    isPurchased={true}
                                    name={i.name}
                                    description={i.description}
                                    price={i.price}
                                    src={i.avatar.thumb_url}
                                    isSm={isSm}
                                />
                            </Box>
                        ))
                    }
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1} isSm={isSm}>
                {
                    playlistOrders.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            id={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.authors}
                            promotion={i?.promotion}
                            children={<PlaylistAudioCount isSm={isSm} audioCount={i?.playlist_counter?.audios_count} />}
                        />
                    ))
                }
            </TabPanel>
        </Box>
    )
}