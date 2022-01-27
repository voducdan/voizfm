// import react
import { useState, useEffect } from 'react';

// import MUI component
import {
    Box,
    Typography,
    Divider
} from '@mui/material';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail'

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

function TabPanel(props) {
    const { children, isSm } = props;
    return (
        <Box
            role="tabpanel"
        >
            <Box
                sx={{
                    ...flexStyle('flex-start', 'center'),
                    columnGap: '10%',
                    rowGap: isSm ? '18px' : '40px',
                    flexWrap: 'wrap'
                }}
            >
                {children}
            </Box>
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

export default function PlaylistOrder() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [playlistOrders, setPlaylistOrders] = useState([]);

    useEffect(() => {
        async function fetchPlaylistOrders() {
            const res = await api.getPlaylistOrders();
            const data = await res.data.data;
            setPlaylistOrders(data)
        }

        fetchPlaylistOrders()
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    textAlign: 'left',
                    ...(isSm && { mb: '32px' })
                }}
            >Đã mua</Typography>
            {
                !isSm && (
                    <Divider sx={{ borderColor: COLORS.blackStroker, mt: '24px', mb: '40px' }} />
                )
            }
            <TabPanel isSm={isSm}>
                {
                    playlistOrders.map(i => (
                        <PlaylistThumnail
                            key={i?.id}
                            name={i.name}
                            src={i?.avatar?.thumb_url}
                            authors={i?.authors}
                            children={<PlaylistAudioCount isSm={isSm} audioCount={i?.playlist_counter?.audios_count} />}
                        />
                    ))
                }
            </TabPanel>
        </Box>
    )
}