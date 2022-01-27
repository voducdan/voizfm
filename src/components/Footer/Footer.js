import { useSelector } from 'react-redux';
import { selectOpenSidebar } from '../../redux/openSidebar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Logo from '../../components/Logo/Logo';
import { Facebook, Instagram, Tiktok, Phone, Email, Location } from '../../components/Icons/index'

import { COLORS, TEXT_STYLE, DRAWER_WIDTH } from '../../utils/constants'

const socials = [Facebook, Instagram, Tiktok]

const infoStyle = {
    color: COLORS.gray2,
    ...TEXT_STYLE.content2
}

const flexStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const infoBox = (icon, content) => (
    <Box sx={{ ...flexStyle, columnGap: '13px' }}>
        {icon()}
        <Typography sx={infoStyle}>{content}</Typography>
    </Box >
)

export default function Footer(props) {

    const openSidebar = useSelector(selectOpenSidebar);

    return (
        <Box sx={{
            width: openSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
            ...(openSidebar && { marginLeft: `${DRAWER_WIDTH}px` }),
            marginTop: '80px'
        }}>
            <Logo />
            <Box sx={{
                color: COLORS.bg4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                columnGap: '30px'
            }}>
                {
                    socials.map((item, idx) => (
                        <Box key={idx}>{item()}</Box>
                    ))
                }
            </Box>
            <Box sx={{ ...flexStyle, flexDirection: 'column', rowGap: '20px', marginTop: '35px', marginBottom: '70px' }}>
                <Typography sx={{
                    ...TEXT_STYLE.title1,

                    color: COLORS.white
                }}>
                    Công Ty Cổ phần Công nghệ WeWe
                </Typography>
                {infoBox(Phone, '0946 110 993')}
                {infoBox(Email, 'support@wewe.vn')}
                {infoBox(Location, '44 Lê Văn Duyệt, P1, Q. Bình Thạnh, TP. HCM')}
            </Box>
        </Box>
    )
}