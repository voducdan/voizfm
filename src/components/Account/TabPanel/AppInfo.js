import { useEffect, useState } from 'react';

// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';

// import mui components
import {
    Box,
    Typography
} from '@mui/material';

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';

// import services
import API from '../../../services/api';

const PanelContent = (props) => (
    <Box
        sx={{
            ...flexStyle('center', 'flex-start'),
            borderRadius: '10px',
            flexDirection: 'column',
            backgroundColor: COLORS.bg2,
            rowGap: '52px',
            padding: '32px 32px 56px 32px'
        }}
    >
        <Typography sx={{ ...TEXT_STYLE.h2, color: COLORS.white }}>Thông tin ứng dụng</Typography>
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column',
                width: '100%'
            }}
        >
            <img style={{ borderRadius: '15px' }} src="/images/logo1.svg" alt="logo1" />
            <img style={{ marginTop: '15px' }} src="/images/logo2.svg" alt="logo2" />
            <Box sx={{
                maxWidth: '265px'
            }}>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.contentIcon,
                        textAlign: 'center',
                        marginTop: '16px'
                    }}
                >
                    WeWe JSC - Mạng xã hội âm thanh.
                    Trải nghiệm nghe và chia sẻ mọi chủ đề, mọi lúc, mọi nơi.
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', marginTop: '24px' }}>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.contentIcon,
                        textAlign: 'center',
                    }}
                >
                    Liên hệ chúng tôi:
                </Typography>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.white,
                        textAlign: 'center',
                    }}
                >&nbsp;copyright@wewe.vn</Typography>
            </Box>
            <img style={{ marginTop: '48px' }} src="/images/cert.svg" alt="logo2" />
            <Typography
                sx={{
                    ...TEXT_STYLE.content1,
                    color: COLORS.contentIcon,
                    marginTop: '16px'
                }}
            >
                Version: {props.currentVersion}
            </Typography>
        </Box>
    </Box>
)

export default function AppInfo(props) {
    const api = new API();
    const [currentVersion, setCurrentVersion] = useState('1.0.0');

    useEffect(() => {
        async function fetchVersion() {
            const res = await api.getVersion();
            const data = await res.data;
        }

        fetchVersion();
    }, []);

    return (
        <TabPanel value={props.value} index={1} children={PanelContent({ currentVersion })}></TabPanel >
    )
}