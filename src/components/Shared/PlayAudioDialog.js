// import next router
import { useRouter } from 'next/router';

import { useSelector, useDispatch} from 'react-redux';
import { selectUser } from '../../redux/user';
import { setOpenLogin } from '../../redux/openLogin';

// import MUI package
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../utils/constants';

export default function PlayAudioDialog(props) {
    const router = useRouter();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const {
        isSm,
        openUnauthorizedModal,
        openUpdateRequiredModal,
        errorMessage,
        setOpenUnauthorizedModal,
        setOpenUpdateRequiredModal,
        handleBuyPlaylist
    } = props;

    const handleUpVipOnPlauAudio = ()=>{
        if(!user){
            dispatch(setOpenLogin(true));
            return;
        }
        router.push('/up-vip')
    }

    return (
        <Box>
            <Dialog
                open={openUnauthorizedModal}
                onClose={() => { setOpenUnauthorizedModal(false) }}
                sx={{
                    '& .MuiPaper-root': {
                        width: isSm ? '95%' : '512px',
                        bgcolor: COLORS.bg1,
                        m: 0,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <DialogContent
                    sx={{
                        p: 0
                    }}
                >
                    <DialogContentText
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            textAlign: 'center',
                            mb: isSm ? '24px' : '32px',
                            p: 0
                        }}
                    >
                        Voiz FM
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            whiteSpace: 'pre-line',
                            mb: '32px'
                        }}
                    >
                        {errorMessage}
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
                            rowGap: '24px'
                        }}
                    >
                        <Button
                            onClick={handleBuyPlaylist}
                            sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                borderRadius: '8px',
                                width: isSm ? '168px' : '192px',
                                height: '48px',
                                bgcolor: COLORS.main
                            }}
                            autoFocus
                        >
                            Mua lẻ sách
                        </Button>
                        <Button
                            onClick={() => { setOpenUnauthorizedModal(false) }}
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                textTransform: 'none'
                            }}
                        >
                            Bỏ qua
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openUpdateRequiredModal}
                onClose={() => { setOpenUpdateRequiredModal(false) }}
                sx={{
                    '& .MuiPaper-root': {
                        width: isSm ? '95%' : '512px',
                        bgcolor: COLORS.bg1,
                        m: 0,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('center', 'center'),
                        mb: isSm ? '24px' : '32px'
                    }}
                >
                    <img
                        style={{
                            width: isSm ? '134px' : '108px',
                            height: isSm ? '134px' : '108px'
                        }}
                        src='/images/upgrade.png'
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
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            textAlign: 'center',
                            mb: '24px',
                            p: 0
                        }}
                    >
                        Nâng cấp ngay
                    </DialogContentText>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            whiteSpace: 'pre-line',
                            mb: '32px'
                        }}
                    >
                        {errorMessage}
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
                                onClick={handleBuyPlaylist}
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    width: isSm ? '168px' : '192px',
                                    height: '48px',
                                    bgcolor: COLORS.bg1,
                                    border: `1px solid ${COLORS.blackStroker}`,
                                    width: '50%'
                                }}
                                autoFocus
                            >
                                Mua lẻ sách
                            </Button>
                            <Button
                                onClick={handleUpVipOnPlauAudio}
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
                                Đăng ký gói
                            </Button>
                        </Box>
                        <Button
                            onClick={() => { setOpenUpdateRequiredModal(false) }}
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                textTransform: 'none'
                            }}
                        >
                            Bỏ qua
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    )
}