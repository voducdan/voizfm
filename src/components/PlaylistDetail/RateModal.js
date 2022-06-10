// import react
import { useState, useEffect } from 'react';

// import MUI components
import {
    Typography,
    Rating,
    TextField,
    Dialog,
    Button,
    Box
} from "@mui/material";

// import others component
import CustomDisabledButton from '../CustomDisabledButton/CustomDisabledButton';

import {
    StarEmpty,
    StarFill
} from '../../components/Icons/index';

// import utils
import { COLORS, TEXT_STYLE } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle';

function RateModal(props) {
    const { contentRating, voiceRating, rateContent, setContentRating, setVoiceRating, setRateContent, recentlyVoiceRating } = props;
    const [isFormValid, setIsFormValid] = useState(true);
    const { open, setOpen, setOpenAfterRate, handleRatePlaylist, isSm } = props;
    useEffect(() => {
        if (contentRating === 0 || voiceRating === 0) {
            setIsFormValid(false);
            return;
        }
        setIsFormValid(true);
    }, [contentRating, voiceRating]);

    const handleClose = () => {
        setVoiceRating(recentlyVoiceRating);
        setOpen(false);
    }

    const handleSubmit = () => {
        handleRatePlaylist(handleOpenAfterRateModal);
        setOpen(false);
    }

    const handleOpenAfterRateModal = () => {
        setOpenAfterRate(true);
    }

    const onShareContentChange = (e) => {
        setRateContent(e.target.value);
    }

    return (
        <Dialog
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: COLORS.bg1,
                    padding: isSm ? '16px 16px 24px 16px' : '40px 56px 56px 56px',
                    borderRadius: isSm ? '10px' : '30px',
                    ...flexStyle('flex-start', 'center'),
                    width: isSm ? '85%' : '400px',
                    margin: 0,
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
                }
            }}
            onClose={handleClose}
            open={open}
        >
            <Box
                sx={{
                    width: '100%',
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                }}
            >
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white,
                        textAlign: 'center',
                        marginBottom: isSm ? '8px' : '32px'
                    }}
                >Voiz FM</Typography>
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                        color: COLORS.white,
                        textAlign: 'center'
                    }}
                >Bạn muốn chia sẻ cụ thể với Voiz không?</Typography>
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        flexDirection: 'column',
                        rowGap: '32px',
                        margin: `${isSm ? '16px' : '48px'} 0`
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '15px'
                        }}
                    >
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.title3 : TEXT_STYLE.content2),
                                color: COLORS.white
                            }}
                        >Nội dung:</Typography>
                        <Rating
                            sx={{
                                ml: '10px',
                                '& .MuiRating-iconEmpty': {
                                    color: COLORS.contentIcon
                                },
                                '& .MuiRating-icon': {
                                    mr: isSm ? '26px' : '35px'
                                }
                            }}
                            onChange={(_, newValue) => {
                                setContentRating(newValue || 0);
                            }}
                            emptyIcon={<StarEmpty fill='#6B6B6B' />}
                            icon={<StarFill fill='#F68C2D' />}
                            name="content-rating"
                            value={contentRating}
                            precision={1}
                        />
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '15px'
                        }}
                    >
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.title3 : TEXT_STYLE.content2),
                                color: COLORS.white
                            }}
                        >Giọng đọc:</Typography>
                        <Rating
                            sx={{
                                ml: '4px',
                                '& .MuiRating-iconEmpty': {
                                    color: COLORS.contentIcon
                                },
                                '& .MuiRating-icon': {
                                    mr: isSm ? '26px' : '35px'
                                }
                            }}
                            onChange={(_, newValue) => {
                                setVoiceRating(newValue || 0);
                            }}
                            emptyIcon={<StarEmpty fill='#6B6B6B' />}
                            icon={<StarFill fill='#F68C2D' />}
                            name="voice-rating"
                            value={voiceRating}
                            precision={1}
                        />
                    </Box>
                </Box>
                <TextField
                    sx={{
                        width: '100%',
                        height: isSm ? '120px' : '186px',
                        '& ::placeholder': {
                            color: `${COLORS.placeHolder}!important`,
                            opacity: 1,
                            ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2)
                        },

                        '& .MuiOutlinedInput-input': {
                            color: COLORS.white,
                            bgcolor: COLORS.bg1,
                            ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2),
                            height: '100%!important'
                        },
                        '& .MuiOutlinedInput-root': {
                            bgcolor: COLORS.bg1,
                            border: `1px solid ${COLORS.blackStroker}`,
                            padding: isSm ? '10px 17px' : '10px 14px',
                            borderRadius: '8px',
                            height: '100%'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        }
                    }}
                    value={rateContent}
                    onChange={onShareContentChange}
                    id="share text area"
                    placeholder="Những đóng góp khác, ví dụ: Cảm nhận nội dung, góp ý nhạc nền, thắc mắc về sách,..."
                    multiline rows={5}
                    variant="outlined"
                    autoComplete="off"
                />
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '16px',
                        width: '100%',
                        marginTop: '32px'
                    }}
                >
                    <Button
                        onClick={handleClose}
                        sx={{
                            width: '50%',
                            bgcolor: COLORS.bg3,
                            ...TEXT_STYLE.title1,
                            textTransform: 'none',
                            color: COLORS.white,
                            height: '48px',
                            borderRadius: '8px'
                        }}
                    >
                        Bỏ qua
                    </Button>
                    <CustomDisabledButton
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        content='Gửi'
                        style={{
                            width: '50%',
                            bgcolor: COLORS.main,
                            ...TEXT_STYLE.title1,
                            textTransform: 'none',
                            color: COLORS.white,
                            height: '48px',
                            borderRadius: '8px'
                        }}
                    />
                </Box>
            </Box>
        </Dialog>
    )
}

function AfterRateModal(props) {
    const { open, setOpen, isSm, content } = props;
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Dialog
            onClose={handleClose}
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: COLORS.bg1,
                    borderRadius: isSm ? '10px' : '30px',
                    ...flexStyle('center', 'center'),
                    width: isSm ? '93%' : '512px',
                    margin: 0,
                    p: isSm ? '0 25px' : '0 66px',
                    boxSizing: 'border-box'
                }
            }}>

            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    width: '70%',
                    padding: '40px 0',
                    boxSizing: 'border-box',
                    width: '100%'
                }}
            >
                <Typography
                    sx={{
                        ...TEXT_STYLE.h1,
                        color: COLORS.white
                    }}
                >Voiz FM</Typography>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.contentIcon,
                        marginTop: '32px',
                        marginBottom: '40px',
                        textAlign: 'center'
                    }}
                >{content}</Typography>
                <Button
                    onClick={handleClose}
                    sx={{
                        width: '50%',
                        bgcolor: COLORS.main,
                        ...TEXT_STYLE.title1,
                        textTransform: 'none',
                        color: COLORS.white,
                        height: '48px',
                        borderRadius: '8px'
                    }}
                >
                    OK
                </Button>
            </Box>

        </Dialog>
    )
}

export { RateModal, AfterRateModal }