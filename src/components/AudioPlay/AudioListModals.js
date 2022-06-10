// import redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/user';

// import MUI components
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Popover,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';


// import others components
import handlePlayAudio from '../../components/Shared/handlePlayAudio';

// import utils
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { flexStyle } from '../../utils/flexStyle';

// import services
import API from '../../services/api';

export default function AudioList(props) {
    const api = new API();

    const {
        anchorAudioList,
        onCloseAudioList,
        audioId,
        playlistId,
        promotion,
        audiosList,
        setErrorMessage,
        setOpenUpdateRequiredModal,
        setOpenUnauthorizedModal,
        setOpenSnackbar
    } = props;
    const user = useSelector(selectUser);
    const open = Boolean(anchorAudioList);
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const dispatch = useDispatch();

    const handlePlayOneAudio = async (audioId) => {
        handlePlayAudio(
            dispatch,
            user,
            audioId,
            playlistId,
            promotion,
            setErrorMessage,
            setOpenUpdateRequiredModal,
            setOpenUnauthorizedModal,
            setOpenSnackbar
        );
    }

    const handleSelectAudio = (id) => {
        handlePlayOneAudio(id);
        onCloseAudioList();
    }

    return (
        <Popover
            anchorEl={anchorAudioList}
            open={open}
            onClose={onCloseAudioList}
            anchorReference="anchorPosition"
            anchorPosition={{ top: isSm ? (windowSize.height - 67) : (windowSize.height - 105), left: isSm ? 0 : (windowSize.width - (windowSize.width / 4)) }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            sx={{
                '& .MuiPopover-paper': {
                    bgcolor: COLORS.bg2,
                    maxWidth: isSm ? '90%' : '632px',
                    maxHeight: isSm ? '70%' : 'calc(100% - 210px)',
                    overflow: isSm ? 'auto' : 'hidden',
                    scrollbarGutter: 'stable',
                    '::-webkit-scrollbar': {
                        width: '4px'
                    },

                    '::-webkit-scrollbar-button': {
                        height: '10px'
                    },

                    '::-webkit-scrollbar-track': {
                        borderRadius: '5px',
                    },

                    '::-webkit-scrollbar-thumb': {
                        background: COLORS.bg3,
                        borderRadius: '5px'
                    },

                    ':hover': {
                        overflowY: 'auto'
                    },
                }
            }}
        >
            <Box
                sx={{
                    bgcolor: COLORS.bg2,
                    width: '100%',
                    height: '100%',
                    padding: isSm ? '26px 15px 0 15px' : '26px 32px 0 26px',
                    boxSizing: 'border-box',
                    borderRadius: '10px'
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('space-between', 'flex-start'),
                        width: '100%'
                    }}
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                            color: COLORS.white,
                            marginBottom: isSm ? '26px' : '32px'
                        }}
                    >Danh sách audios</Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onCloseAudioList}
                        sx={{
                            p: 0,
                            color: COLORS.white,
                            bgcolor: COLORS.bg2
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <List sx={{ width: '100%' }}>
                        {audiosList.map((value) => {
                            return (
                                <ListItem
                                    sx={{
                                        paddingLeft: 0,
                                        paddingRight: '20px',
                                        borderTop: `.5px solid ${COLORS.placeHolder}`,
                                        height: '72px',
                                        ...(value.id === audioId && {
                                            bgcolor: COLORS.bg3,
                                            borderRadius: '6px',
                                            borderTop: 'none'
                                        }),
                                        ...(value.id === (audioId + 1) && {
                                            borderTop: 'none'
                                        })
                                    }}
                                    secondaryAction={
                                        value.id === audioId && (
                                            <IconButton edge="end" aria-label="delete">
                                                <GraphicEqIcon sx={{ color: COLORS.contentIcon }} />
                                            </IconButton>
                                        )
                                    }
                                    key={value.id}
                                >
                                    <ListItemButton role={undefined} onClick={() => { handleSelectAudio(value.id) }} dense>
                                        <ListItemText
                                            sx={{
                                                'span': {
                                                    ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                    color: COLORS.white,
                                                    display: '-webkit-box',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }
                                            }}
                                            id={`label-${value.id}`} primary={value.name} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Box>
        </Popover>

    )
}