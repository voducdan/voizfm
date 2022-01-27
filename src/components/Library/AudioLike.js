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
    DialogTitle
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';

// import others components
import PlaylistThumnail from '../../components/Shared/PlaylistThumbnail'

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
            <AccessTimeIcon sx={{ color: COLORS.contentIcon, width: isSm ? '12px' : '16px', height: isSm ? '12px' : '16px' }} />
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
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const pageLimit = 10;


    useEffect(() => {
        async function fetchAudioLikes() {
            const res = await api.getAudioLikes(audioPage, pageLimit);
            const data = await res.data.data;
            const initDeleteList = data.map(i => ({ id: i.id, checked: false }));
            setAudioLikes([...data]);
            setDeleteList(initDeleteList);
        }

        fetchAudioLikes()
    }, []);

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
            setSingleItemIdToDelete(null);
        }
        else {
            const selectdItems = deleteList.filter(i => i.checked === true).map(i => i.id);
            remainItems = audioLikes.filter(i => !(selectdItems.includes(i.id)));
            initDeleteList = remainItems.map(i => ({ id: i.id, checked: false }));
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
        const id = e.target.value;
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
                    !isDeleteMode && (
                        <Button
                            onClick={handleGoDelete}
                            sx={{
                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                color: COLORS.white,
                                textTransform: 'none'
                            }}
                            endIcon={<DeleteIcon fontSize="small" sx={{ color: COLORS.VZ_Text_content }} />}
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
                        >Hoàn thành</Button>
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
                                        value={i?.id}
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
                                    // src={i?.avatar?.thumb_url}
                                    // Mock server images is currently error
                                    src='https://picsum.photos/335/335?img=16'
                                    authors={i?.author?.name}
                                    hasDelete={true}
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
        </Box>
    )
}