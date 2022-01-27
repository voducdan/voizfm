// import react
import { useEffect } from 'react';

// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';

// import mui components
import {
    Typography,
    Dialog,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// import react share
import {
    EmailShareButton,
    FacebookShareButton,
    FacebookMessengerShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    LinkedinIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';

const socials = [
    {
        name: 'email',
        component: () => (
            <EmailShareButton url='http://13.251.106.4/'>
                <EmailIcon />
            </EmailShareButton>
        )
    },
    {
        name: 'facebook',
        component: () => (
            <FacebookShareButton url='http://13.251.106.4/'>
                <FacebookIcon />
            </FacebookShareButton>
        )
    },
    {
        name: 'messenger',
        component: () => (
            <FacebookMessengerShareButton url='http://13.251.106.4/'>
                <FacebookMessengerIcon />
            </FacebookMessengerShareButton>
        )
    },
    {
        name: 'linkedln',
        component: () => (
            <LinkedinShareButton url='http://13.251.106.4/'>
                <LinkedinIcon />
            </LinkedinShareButton>
        )
    },
    {
        name: 'telegram',
        component: () => (
            <TelegramShareButton url='http://13.251.106.4/'>
                <TelegramIcon />
            </TelegramShareButton>
        )
    },
    {
        name: 'twitter',
        component: () => (
            <TwitterShareButton url='http://13.251.106.4/'>
                <TwitterIcon />
            </TwitterShareButton>
        )
    },
    {
        name: 'whatapps',
        component: () => (
            <WhatsappShareButton url='http://13.251.106.4/'>
                <WhatsappIcon />
            </WhatsappShareButton>
        )
    },
]

const PanelContent = (props) => {
    const { isSm, open, setOpen } = props;
    const handleClose = () => {
        setOpen(false);
    }
    return (
        < Dialog
            sx={{
                width: '100vw',
                '& .MuiDialog-paper': {
                    bgcolor: COLORS.bg1,
                    width: isSm ? '100%' : '40%',
                    height: '80vh',
                    maxWidth: '512px',
                    maxHeight: '646px',
                    margin: 0
                }
            }}
            open={open}
            onClose={handleClose}
        >
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: COLORS.white,
                    bgcolor: COLORS.bg2
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box
                sx={{
                    ...flexStyle('center', 'flex-start'),
                    width: '100%',
                    mb: '40px'
                }}
            >
                <Typography sx={{
                    marginTop: '40px',
                    ...TEXT_STYLE.h1,
                    color: COLORS.white
                }}>Mời bạn bè qua</Typography>
            </Box>
            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    margin: '0 40px',
                    flexWrap: 'wrap',
                    rowGap: '20px',
                    columnGap: '20px'
                }}
            >
                {
                    socials.map(i => (
                        <Box key={i.name}>
                            {i.component()}
                        </Box>
                    ))
                }
            </Box>
        </Dialog>
    )
}

export default function InviteFriend(props) {
    const { open, setOpen, isSm, value } = props;
    return (
        <TabPanel value={value} index={2} children={PanelContent({ isSm, open, setOpen })}></TabPanel>
    )
}