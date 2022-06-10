// import react
import { useState, useEffect } from 'react';

// import MUI component
import {
    Box,
    Typography,
    Divider,
    Button,
    Radio,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert
} from '@mui/material';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail'
import { AccessTime, Trash } from '../../components/Icons/index'

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatDuration from '../../utils/formatDuration';

// import service
import API from '../../services/api';

function TabPanel(props) {
    const { children, isSm } = props;
    return (
        <Box
            role="tabpanel"
        >
            <Box
                sx={{
                    ...flexStyle('flex-start', 'center'),
                    columnGap: '10%',
                    rowGap: isSm ? '18px' : '40px',
                    flexWrap: 'wrap'
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

const AudioDuration = (props) => {
    const { duration, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: '6px'
            }}
        >
            <AccessTime />
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                    color: COLORS.contentIcon
                }}
            >
                {formatDuration(duration)}
            </Typography>
        </Box>
    )
}

export default function AudioLike() {
    const api = new API();
    const windowSize = useWindowSize();
    const [audioPage, setAudioPage] = useState(0);
    const [audioLikes, setAudioLikes] = useState([]);
    const [deleteList, setDeleteList] = useState([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isSelectDeleteAll, setIsSelectDeleteAll] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [singleItemIdToDelete, setSingleItemIdToDelete] = useState(null);
    const [confirmDeleteModalText, setConfirmDeleteModalText] = useState('');
    const [openUnLikeAudioErrorSnackbar, setOpenUnLikeAudioErrorSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const pageLimit = 10;


    useEffect(() => {
        async function fetchAudioLikes() {
            try {
                const res = await api.getAudioLikes(audioPage, pageLimit);
                const data = await res.data.data;
                const initDeleteList = data.map(i => ({ id: i.id, checked: false }));
                setAudioLikes([...data]);
                setDeleteList(initDeleteList);
            }
            catch (err) {
                const errList = err.response.data.error;
                if (errList instanceof Object) {
                    let errMessage = '';
                    for (let e in errList) {
                        const key = Object.keys(errList[e])[0];
                        const value = errList[e][key]
                        errMessage += `${value} \n`
                    }
                    setErrorMessage(errMessage)
                    setOpenUnLikeAudioErrorSnackbar(true);
                    return;
                }
                setOpenUnLikeAudioErrorSnackbar(true);
                setErrorMessage(errList)
            }
        }

        fetchAudioLikes()
    }, []);

    const unLikeAudio = async (audioId) => {
        try {
            await api.likeAudio(audioId);
        }
        catch (err) {
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setErrorMessage(errMessage)
                setOpenUnLikeAudioErrorSnackbar(true);
                return;
            }
            setOpenUnLikeAudioErrorSnackbar(true);
            setErrorMessage(errList)
        }
    }

    const unLikeMultiAudio = async (audioIds) => {
        try {
            await api.unLikeMultiAudio(audioIds);
        }
        catch (err) {
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setErrorMessage(errMessage)
                setOpenUnLikeAudioErrorSnackbar(true);
                return;
            }
            setOpenUnLikeAudioErrorSnackbar(true);
            setErrorMessage(errList)
        }
    }

    const handleGoDelete = () => {
        const tmpIsDeleteMode = !isDeleteMode;
        setIsDeleteMode(tmpIsDeleteMode)
    }

    const handleSubmitDelete = () => {
        let remainItems = null;
        let initDeleteList = null;
        if (singleItemIdToDelete) {
            remainItems = audioLikes.filter(i => i.id !== singleItemIdToDelete);
            initDeleteList = remainItems.map(i => ({ id: i.id, checked: false }));
            unLikeAudio(singleItemIdToDelete);
            setSingleItemIdToDelete(null);
        }
        else {
            const selectdItems = deleteList.filter(i => i.checked === true).map(i => i.id);
            remainItems = audioLikes.filter(i => !(selectdItems.includes(i.id)));
            initDeleteList = remainItems.map(i => ({ id: i.id, checked: false }));
            for (let i of selectdItems) {
                unLikeAudio(i);
            }
        }
        setIsSelectDeleteAll(false);
        setDeleteList(initDeleteList);
        setAudioLikes(remainItems);
        setIsDeleteMode(false);
        handleConfirmDeleteModalClose();
    }

    const handleClickDeleteSingleAudio = (e) => {
        handleConfirmDeleteModalOpen('Bạn có chắc chắn muốn xóa audio này không?');
        const id = Number(e.currentTarget.id);
        setSingleItemIdToDelete(id);
        e.stopPropagation();
    }

    const handleConfirmDeleteModalClose = () => {
        setConfirmDeleteModal(false);
    };

    const handleConfirmDeleteModalOpen = (content) => {
        setConfirmDeleteModalText(content);
        setConfirmDeleteModal(true);
    };

    const handleSelectAll = (e) => {
        const tmpIsSelectDeleteAll = !isSelectDeleteAll;
        var isCheckAll = false;
        if (tmpIsSelectDeleteAll) {
            isCheckAll = true;
        }
        const tmpDeleteList = deleteList.map(i => ({ id: i.id, checked: isCheckAll }));
        setDeleteList(tmpDeleteList);
        setIsSelectDeleteAll(tmpIsSelectDeleteAll);
    }

    const handleSelectDeleteItem = (e) => {
        const tmpDeleteList = [...deleteList];
        const id = Number(e.target.value);
        tmpDeleteList[id]['checked'] = !tmpDeleteList[id]['checked'];
        const numCheckItems = tmpDeleteList.filter(i => i.checked === true).length;
        let isDeleteAll = numCheckItems === deleteList.length ? true : false;

        setIsSelectDeleteAll(isDeleteAll);
        setDeleteList(tmpDeleteList);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    textAlign: 'left',
                    ...(isSm && { mb: '32px' })
                }}
            >Thích
            </Typography>
            <Box
                sx={{
                    ...(!isDeleteMode ? flexStyle('flex-end', 'center') : flexStyle('space-between', 'center')),
                    mt: '27px'
                }}
            >
                {
                    (!isDeleteMode && audioLikes.length > 0) && (
                        <Button
                            onClick={handleGoDelete}
                            sx={{
                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                color: COLORS.white,
                                textTransform: 'none'
                            }}
                            endIcon={<Trash fontSize="small" />}
                        >Xóa tất cả</Button>
                    )
                }
                {
                    isDeleteMode && (
                        <FormControlLabel
                            control={
                                <Radio
                                    onClick={handleSelectAll}
                                    checked={isSelectDeleteAll}
                                    sx={{
                                        color: COLORS.placeHolder,
                                        pl: 0,
                                        '&.Mui-checked': {
                                            color: COLORS.second
                                        }
                                    }}
                                />
                            }
                            label="Chọn tất cả"
                            sx={{
                                color: COLORS.white,
                                ml: 0
                            }}
                        />
                    )
                }
                {
                    isDeleteMode && (
                        <Button
                            onClick={() => { handleConfirmDeleteModalOpen('Bạn có chắc chắn muốn xóa những audio này không?') }}
                            sx={{
                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                color: COLORS.white,
                                textTransform: 'none'
                            }}
                        >Xoá</Button>
                    )
                }
            </Box>
            <Divider sx={{ borderColor: COLORS.blackStroker, mt: '13px', mb: isSm ? '32px' : '40px' }} />

            <TabPanel isSm={isSm}>
                {
                    audioLikes.map((i, idx) => (
                        <Box
                            key={i?.id}
                            sx={{
                                width: isSm ? '100%' : '45%',
                                ...flexStyle('flex-start', 'center')
                            }}
                        >
                            {
                                isDeleteMode && (
                                    <Radio
                                        checked={deleteList[idx] ? deleteList[idx]['checked'] : false}
                                        onClick={handleSelectDeleteItem}
                                        value={idx}
                                        sx={{
                                            color: COLORS.placeHolder,
                                            pl: 0,
                                            '&.Mui-checked': {
                                                color: COLORS.second
                                            }
                                        }}
                                    />
                                )
                            }
                            <Box
                                sx={{
                                    width: '100%'
                                }}
                            >
                                <PlaylistThumnail
                                    id={i?.id}
                                    name={i?.name}
                                    src={i?.avatar?.thumb_url}
                                    authors={i?.author?.name}
                                    hasDelete={true}
                                    promotion={i?.promotion}
                                    isAudio={true}
                                    playlistId={i?.playlist_id}
                                    handleConfirmDeleteModalOpen={handleClickDeleteSingleAudio}
                                    children={<AudioDuration isSm={isSm} duration={i?.duration} />}
                                />
                            </Box>
                        </Box>
                    ))
                }
            </TabPanel>
            <Dialog
                open={confirmDeleteModal}
                onClose={handleConfirmDeleteModalClose}
                sx={{
                    '& .MuiPaper-root': {
                        bgcolor: COLORS.bg1,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white,
                        textAlign: 'center'
                    }}
                >
                    Voiz FM
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center'
                        }}
                    >
                        {confirmDeleteModalText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '16px'
                    }}
                >
                    <Button
                        onClick={handleConfirmDeleteModalClose}
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            borderRadius: '8px',
                            maxWidth: '192px',
                            width: 'calc(50% - 8px)',
                            height: '48px',
                            bgcolor: COLORS.bg3
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            borderRadius: '8px',
                            maxWidth: '192px',
                            width: 'calc(50% - 8px)',
                            height: '48px',
                            bgcolor: COLORS.main
                        }}
                        onClick={handleSubmitDelete}
                        autoFocus
                    >
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openUnLikeAudioErrorSnackbar}
                autoHideDuration={6000}
                onClose={() => { setOpenUnLikeAudioErrorSnackbar(false) }}
            >
                <Alert onClose={() => { setOpenUnLikeAudioErrorSnackbar(false) }} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}