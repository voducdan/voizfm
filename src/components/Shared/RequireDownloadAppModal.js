// import MUI components
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../utils/constants';

export default function RequireDownloadAppModal(props) {
    const { isSm, router, openDonwloadAppModal, setOpenDonwloadAppModal } = props;
    return (
        <Dialog
            open={openDonwloadAppModal}
            onClose={() => { setOpenDonwloadAppModal(false) }}
            sx={{
                '& .MuiPaper-root': {
                    width: isSm ? '95%' : '512px',
                    bgcolor: COLORS.bg1,
                    m: 0,
                    p: '40px 56px',
                    boxSizing: 'border-box',
                    borderRadius: isSm ? '10px' : '30px',
                    position: 'relative',
                    overflow: 'visible',
                    ...(isSm && { m: '0 16px' })
                }
            }}
        >
            <IconButton
                aria-label="close"
                onClick={() => { setOpenDonwloadAppModal(false) }}
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
                    position: 'absolute',
                    top: isSm ? '-24%' : '-37%',
                    left: '50%',
                    transform: 'translate(-50%,50%)',
                    width: isSm ? '60px' : '80px',
                    height: isSm ? '60px' : '80px',
                    ...flexStyle('center', 'center')
                }}
            >
                <img
                    style={{
                        width: isSm ? '60px' : '80px',
                        height: isSm ? '60px' : '80px',
                        borderRadius: '50%'
                    }}
                    src='/images/apple-touch-icon.png'
                    alt='upgrade img'
                />
            </Box>
            <DialogContent
                sx={{
                    p: 0
                }}
            >
                <DialogContentText
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.contentIcon,
                        textAlign: 'center',
                        whiteSpace: 'pre-line',
                        mb: '32px',
                        mt: '15px'
                    }}
                >
                    Hiện tại website chỉ nghe được chương 1, <br />
                    vui lòng tải app để nghe trọn bộ.
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{
                    ...flexStyle('center', 'center')
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column',
                        rowGap: '24px',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            ...flexStyle('center', 'center'),
                            columnGap: '16px'
                        }}
                    >
                        <Button
                            onClick={() => { router.push('https://play.google.com/store/apps/details?id=com.wewe.musicsounds') }}
                            sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                borderRadius: '8px',
                                width: isSm ? '168px' : '192px',
                                height: '48px',
                                bgcolor: COLORS.main,
                                width: '50%'
                            }}
                            autoFocus
                        >
                            Tải về
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    )
} 