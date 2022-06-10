// import react
import { useState, useEffect } from "react";

// import MUI components
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Box,
    Tooltip,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// import react QRcode
import QRCode from 'qrcode.react';
// import react share
import {
    FacebookShareButton
} from "react-share";

// import icons
import { FacebookClassic, MessengerClassic, Hyperlink, QR } from '../../components/Icons/index';

// import utils
import { COLORS, TEXT_STYLE } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle';


export default function ShareModal(props) {

    const { url, open, setOpen, isSm } = props;
    const shareIconSize = isSm ? 40 : 48;
    const [openCopyLinkTooltop, setOpenCopyLinkTooltop] = useState(false);
    const [openQRcodeDialog, setOpenQRcodeDialog] = useState(false);
    const [tooltipTitle, setTooltipTitle] = useState('Sao chép link thành công!');

    useEffect(() => {
        window.fbAsyncInit = function () {
            FB.init({
                appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v13.0'
            });
        };
        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const handleClose = () => {
        setOpen(false)
    }

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
        }
        else {
            setTooltipTitle('Đã xảy ra lỗi khi sao chép link!')
        }
        setOpenCopyLinkTooltop(true);
        setTimeout(() => {
            setOpenCopyLinkTooltop(false);
        }, 1000);
    };

    const handleCreateQR = () => {
        setOpenQRcodeDialog(true);
    }

    const handleCloseQRCodeDialog = () => {
        setOpenQRcodeDialog(false);
    }

    const deviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };

    const shareItems = [
        {
            label: 'Facebook',
            icon: <FacebookShareButton url={url}><FacebookClassic size={shareIconSize} /> </FacebookShareButton>
        },
        {
            label: 'Messenger',
            icon:
                <Box
                    sx={{
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        if (deviceType() === 'desktop') {
                            FB.ui({
                                method: 'send',
                                link: url
                            });
                        }
                        else {
                            window.open('fb-messenger://share?link=' + encodeURIComponent(url) + '&app_id=' + encodeURIComponent(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID));
                        }
                    }}
                >
                    <MessengerClassic size={shareIconSize} />
                </Box>
        },
        {
            label: 'QR Code',
            icon: (
                <IconButton
                    sx={{
                        p: 0
                    }}
                    onClick={handleCreateQR}
                >
                    <Hyperlink size={shareIconSize} />
                </IconButton>
            )
        },
        {
            label: 'Link',
            icon: (
                <Tooltip
                    PopperProps={{
                        disablePortal: true,
                    }}
                    open={openCopyLinkTooltop}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={tooltipTitle}
                >
                    <IconButton
                        onClick={handleCopyLink}
                        sx={{
                            p: 0
                        }}>
                        <QR size={shareIconSize} />
                    </IconButton>
                </Tooltip>
            )
        }
    ]

    return (
        <Dialog
            onClose={handleClose} open={open}
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: COLORS.bg1,
                    borderRadius: isSm ? '10px' : '30px',
                    ...flexStyle('center', 'center'),
                    width: isSm ? '95%' : '512px',
                    margin: 0
                }
            }}>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 14,
                    top: 11,
                    color: COLORS.white,
                    bgcolor: COLORS.bg2
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    rowGap: '40px',
                    width: '70%',
                    padding: '40px 0',
                    boxSizing: 'border-box'
                }}
            >
                <Typography
                    sx={{
                        ...TEXT_STYLE.h1,
                        color: COLORS.white
                    }}
                >Share</Typography>
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '56px'
                    }}
                >
                    {
                        shareItems.map((item, idx) => (
                            <Box
                                sx={{
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    rowGap: '16px',
                                    width: 'max-content'
                                }}
                                key={idx}>
                                {item.icon}
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.caption12 : TEXT_STYLE.content2),
                                        color: COLORS.white
                                    }}
                                >{item.label}</Typography>
                            </Box>
                        ))
                    }
                </Box>
            </Box>
            {/* QRCode dialog */}
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: isSm ? '10px' : '30px',
                        ...flexStyle('center', 'center'),
                        width: isSm ? '95%' : '40%',
                        margin: 0
                    }
                }}
                open={openQRcodeDialog}
                onClose={handleCloseQRCodeDialog}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleCloseQRCodeDialog}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 0,
                        color: COLORS.bg2
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogTitle >
                    QR code
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <QRCode value={url} />
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
