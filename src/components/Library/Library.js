// import react
import { useState } from 'react';

// import others component
import ListenedList from './ListenedList';
import PlaylistOrder from './PlaylistOrder';
import PlaylistBookmark from './PlaylistBookmark';
import AudioLike from './AudioLike';

// import MUI component
import {
    Box,
    Typography
} from '@mui/material';

// import icons 
import {
    LibraryBook,
    LibraryBookmark,
    LibraryHeart,
    LibraryClock
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';


const Tab = (props) => {
    const { id, icon, text, tab, onClick, isSm } = props
    return (
        <Box
            id={id}
            onClick={onClick}
            sx={{
                ...flexStyle('center', 'center'),
                width: isSm ? 'calc(100% / 4 - 1.5px)' : 'calc(100% / 4 - 18px)',
                height: '90px',
                boxSizing: 'border-box',
                columnGap: '16px',
                bgcolor: (id === tab) ? COLORS.bg3 : COLORS.bg2,
                cursor: 'pointer',
                borderRadius: isSm ? '4px' : '6px',
                ...(isSm && { flexDirection: 'column', rowGap: '8px' })
            }}
        >
            <Box
                sx={{
                    padding: isSm ? '8px' : '15px',
                    bgcolor: (id === tab) ? COLORS.second : COLORS.bg3,
                    borderRadius: '50%',
                    ...flexStyle('center', 'center')
                }}
            >
                {icon}
            </Box>
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.title3 : TEXT_STYLE.h3),
                    color: (id === tab) ? COLORS.white : COLORS.contentIcon
                }}
            >
                {text}
            </Typography>
        </Box>
    )
}

const TabPanel = (props) => {
    const { tab } = props;
    switch (tab) {
        case 1:
            return <ListenedList />
        case 2:
            return <PlaylistOrder />
        case 3:
            return <PlaylistBookmark />
        case 4:
            return <AudioLike />
        default:
            return <ListenedList />
    }
}

const tabItems = [
    {
        id: 1,
        text: 'Lịch sử nghe',
        icon: LibraryClock
    },
    {
        id: 2,
        text: 'Đã mua',
        icon: LibraryBook
    },
    {
        id: 3,
        text: 'Đánh dấu',
        icon: LibraryBookmark
    },
    {
        id: 4,
        text: 'Thích',
        icon: LibraryHeart
    }
]

export default function Library() {
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [tab, setTab] = useState(1);

    const handleTabClick = (e) => {
        const id = Number(e.currentTarget.id);
        setTab(id)
        e.stopPropagation();
    };

    return (
        <Box sx={{
            width: '100%',
            p: isSm ? '16px 16px 32px 16px' : '16px 43px',
            boxSizing: 'border-box'
        }}
        >
            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    columnGap: isSm ? '2px' : '24px'
                }}
            >
                {
                    tabItems.map(i => (
                        <Tab onClick={handleTabClick} isSm={isSm} tab={tab} id={i.id} key={i.id} icon={i.icon({ fill: (i.id === tab) ? COLORS.white : COLORS.second })} text={i.text} />
                    ))
                }
            </Box>
            <Box
                sx={{
                    mt: isSm ? '32px' : '24px',
                    bgcolor: COLORS.bg2,
                    padding: isSm ? '32px 16px' : '32px',
                    boxSizing: 'border-box',
                    borderRadius: '10px'
                }}
            >
                <TabPanel tab={tab} />
            </Box>
        </Box>
    )
}