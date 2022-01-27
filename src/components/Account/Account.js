// import react module
import { useState, useEffect } from 'react';

// import redux
import { useSelector } from 'react-redux';

// import redux action
import { selectUser } from '../../redux/user';


// import MUI package 
import { styled } from '@mui/material/styles';
import {
    Box,
    Tabs,
    Tab,
    Button,
    Menu,
    MenuItem
} from '@mui/material';


// Import icons
import {
    Pencil,
    HorizontalMore,
    RightArrow,
    Save,
    Share,
    Feedback,
    Rate
} from '../../components/Icons/index';

// import others components
import TabPanel from '../../components/TabPanel/TabPanel';
import Info from './Info';
import HistoryTransaction from './TabPanel/HistoryTransaction';
import QRUpload from './TabPanel/QRUpload';
import AppInfo from './TabPanel/AppInfo';
import InviteFriend from './TabPanel/InviteFriend';
import BeCreator from './TabPanel/BeCreator';
import EditProfileModal from './EditProfileModal';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, HEADER_HEIGHT_MB, HEADER_HEIGHT, COLORS, TEXT_STYLE, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import services
import API from '../../services/api'


const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-flexContainer': {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 110,
        width: '100%',
        backgroundColor: COLORS.main,
    },
    '& .MuiTabs-scrollButtons': {
        color: COLORS.contentIcon
    }
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        marginRight: theme.spacing(1),
        color: COLORS.contentIcon,
        ...TEXT_STYLE.title2,
        padding: '12px 16px',
        margin: 0,
        '&.Mui-selected': {
            color: COLORS.white,
        },
        '&.Mui-focusVisible': {
            backgroundColor: COLORS.main,
        },
    }),
);

const PopUpContent = [
    {
        id: 1,
        text: 'Điều khoản ứng dụng',
        startIcon: <Save />
    },
    {
        id: 2,
        text: 'Phản hồi cho chúng tôi',
        startIcon: <Feedback />
    },
    {
        id: 3,
        text: 'Chia sẻ Voiz cho bạn bè',
        startIcon: <Share bgfill='none' fill={COLORS.white} />
    },
    {
        id: 4,
        text: 'Đánh giá Voiz tại store',
        startIcon: <Rate />
    }
]

const tabsList = [
    'Lịch sử giao dịch',
    'Thông tin ứng dụng',
    'Mời bạn bè',
    'Trở thành creator',
    'Quét mã QR'
]

const PopUpButton = (props) => {
    const { id, startIcon, text, setOpenInviteFriend, setValue } = props;

    const handleClickItem = () => {
        switch (id) {
            case 1:
                window.open('https://voiz.vn/chinh-sach-quy-dinh-chung', '_blank').focus();
                break;
            case 2:
                window.open('mailto:support@wewe.vn');
                break;
            case 3:
                setValue(2);
                setOpenInviteFriend(true);
                break;
            case 4:
                window.open('https://play.google.com/store/apps/details?id=com.wewe.musicsounds', '_blank').focus();
                break;
        }
    }
    return (
        <MenuItem
            key={id}
            onClick={handleClickItem}
        >
            <Button sx={{
                ...TEXT_STYLE.content2,
                color: COLORS.white,
                textTransform: 'none',
                width: '100%',
                justifyContent: 'flex-start',
                '& .MuiButton-endIcon': {
                    marginLeft: '113px',
                    position: 'absolute',
                    right: 0
                },
                '& .MuiButton-startIcon': {
                    marginRight: '34px'
                }
            }}
                endIcon={<RightArrow fill={COLORS.contentIcon} />}
                startIcon={startIcon}
            >{text}
            </Button>
        </MenuItem>

    )
}

export default function Account() {
    const api = new API();

    const windowSize = useWindowSize()
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const coverImgHeight = isSm ? 260 : 380
    const accountData = useSelector(selectUser);
    const [value, setValue] = useState(0);
    const [accAnchorEl, setAccAnchorEl] = useState(null);
    const [openInviteFriend, setOpenInviteFriend] = useState(false);
    const [openEditProfile, setopenEditProfile] = useState(false);
    const openMore = Boolean(accAnchorEl);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 2) {
            setOpenInviteFriend(true);
        } else {
            setOpenInviteFriend(false);
        }
    };

    const handleEditProfileOpen = () => {
        setopenEditProfile(true)
    }

    const handleClickMore = (event) => {
        setAccAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAccAnchorEl(null);
    };

    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: isSm ? HEADER_HEIGHT_MB : HEADER_HEIGHT,
                    height: `${coverImgHeight}px`,
                    width: isSm ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`
                }}
            >
                <img style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    left: 0,
                }} alt="cover img alt" src={accountData?.avatar?.original_url}></img>
            </Box>
            <Info accountData={accountData} />
            <Box
                sx={{
                    width: isSm ? '100%' : '95%',
                    borderRadius: '10px'
                }}
            >
                <Box>
                    <StyledTabs
                        value={value}
                        onChange={handleTabChange}
                        aria-label="account tab"
                        scrollButtons="auto"
                        variant="scrollable"
                    >
                        {
                            tabsList.map((label, idx) => (
                                <StyledTab key={idx} label={label} />
                            ))
                        }

                        <Box sx={{
                            width: isSm ? '90%' : '30%',
                            marginLeft: '16px'
                        }}>
                            <Button
                                sx={{
                                    width: '100%',
                                    height: '36px',
                                    bgcolor: COLORS.bg2,
                                    color: COLORS.contentIcon,
                                    textTransform: 'none',
                                    ...TEXT_STYLE.title2
                                }}
                                startIcon={<Pencil />}
                                onClick={handleEditProfileOpen}
                            >Thay đổi thông tin cá nhân</Button>
                        </Box>
                        <EditProfileModal open={openEditProfile} setOpen={setopenEditProfile} />
                        <Box
                            sx={{
                                width: '81px',
                                height: '36px',
                                marginLeft: '11px',
                                bgcolor: COLORS.bg2,
                                borderRadius: '4px',
                                ...flexStyle('center', 'center')
                            }}
                        >
                            <Button
                                id="account-more-button"
                                aria-controls="account-more"
                                aria-haspopup="true"
                                aria-expanded={openMore ? 'true' : undefined}
                                onClick={handleClickMore}
                            >
                                <HorizontalMore />
                            </Button>
                            <Menu
                                sx={{
                                    '& .MuiMenu-paper': {
                                        p: '24px',
                                        width: '360px',
                                        bgcolor: COLORS.bg2
                                    }
                                }}
                                id="account-more"
                                anchorEl={accAnchorEl}
                                open={openMore}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'account-more'
                                }}
                            >
                                {
                                    PopUpContent.map((item) => (
                                        <PopUpButton key={item.id} id={item.id} startIcon={item.startIcon} text={item.text} setOpenInviteFriend={setOpenInviteFriend} setValue={setValue} />
                                    ))
                                }
                            </Menu>
                        </Box>
                    </StyledTabs>
                </Box>
                <HistoryTransaction value={value} isSm={isSm} />
                <AppInfo value={value} />
                <InviteFriend key={openInviteFriend} isSm={isSm} value={value} open={openInviteFriend} setOpen={setOpenInviteFriend} />
                <BeCreator value={value} isSm={isSm} />
                <QRUpload value={value} isSm={isSm} />
                <Box />
            </Box >
        </Box >
    )
}