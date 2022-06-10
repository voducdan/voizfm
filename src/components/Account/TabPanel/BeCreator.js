import { useEffect, useState } from 'react';

// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';
import CustomDisabledButton from '../../../components/CustomDisabledButton/CustomDisabledButton';

// import mui components
import {
    Box,
    Typography,
    TextField,
    FormControl,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material'

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';


// import service
import API from '../../../services/api';

const beCreatorField = [
    {
        name: 'full_name',
        label: 'Họ tên*',
        placeholder: 'Nhập họ tên',
    },
    {
        name: 'phone_number',
        label: 'Số điện thoại*',
        placeholder: 'Nhập số điện thoại',
    },
    {
        name: 'email',
        label: 'Email*',
        placeholder: 'Nhập email',
    },
    {
        name: 'title',
        label: 'Liên quan đến*',
        placeholder: 'Liên quan đến',
    },
    {
        name: 'description',
        label: 'Nội dung*',
        placeholder: 'Nhập nội dung',
    },
]

const PanelContent = (props) => {
    const api = new API();

    const { isSm } = props;
    const [userInfo, setUserInfo] = useState({});
    const [hasError, setHasError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        validateForm();
    }, [userInfo]);

    const handleChangeCreatorInfo = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let user = { ...userInfo };
        user[name] = value;
        setUserInfo({ ...user });
    }

    const handleSubmitCreator = async () => {
        try {
            const res = await api.beCreator(userInfo);
            const data = await res.data;
            if (data.error) {
                setHasError(true);
                setError(data.error);
                return;
            }
            setHasError(true);
            setError('Đăng ký trở thành creator thành công!!!!');
        }
        catch (err) {
            setHasError(true);
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${key} ${value} \n`
                }
                setError(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                return;
            }
            setError(errList);
        }
    }

    const handleCloseErrorDialog = () => {
        setHasError(false);
        setError('');
    }

    const validateForm = () => {
        for (let i of Object.keys(userInfo)) {
            if (!userInfo[i]) {
                setIsFormValid(false);
                return;
            }
        }
        setIsFormValid(true);
    }

    return (
        <Box
            sx={{
                ...flexStyle('center', 'flex-start'),
                flexDirection: 'column',
                borderRadius: '10px',
                backgroundColor: COLORS.bg2,
                rowGap: '32px',
                padding: isSm ? '16px 16px 0 16px' : '32px 32px 0 32px',
            }}>
            <Typography sx={{ ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2), color: COLORS.white }}>Trở thành creator</Typography>
            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    rowGap: '16px',
                    width: '100%',
                    padding: isSm ? '16px' : '32px',
                    boxSizing: 'border-box',
                    borderRadius: '10px',
                    border: '1px solid #595959'
                }}
            >
                <Typography sx={{ ...TEXT_STYLE.h3, color: COLORS.white }}>Liên hệ với chúng tôi</Typography>
                <Typography sx={{
                    ...TEXT_STYLE.content1,
                    color: COLORS.contentIcon,
                    maxWidth: isSm ? '95%' : '77%',
                    textAlign: 'center'
                }}>Chúng tôi luôn ghi nhận  các đóng góp ý kién và đề xuất hợp tác của bạn để cải tiến và nâng cấp sản phẩm WeWe ngày một hoàn thiện và hữu ích hơn. Đừng ngại chia sẻ ý tưởng cho chúng tôi.</Typography>

                <FormControl
                    sx={{
                        width: '100%',
                        ...flexStyle('center', 'flex-start'),
                        rowGap: '24px'
                    }}
                >
                    {
                        beCreatorField.map((item, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    ...flexStyle('space-between', 'center'),
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    sx={{
                                        width: '15%',
                                        ...TEXT_STYLE.content1,
                                        color: COLORS.contentIcon,
                                        ...(isSm && { display: 'none' })
                                    }}
                                >{item.label}</Typography>
                                <TextField
                                    sx={{
                                        width: isSm ? '100%' : '85%',
                                        '& .MuiOutlinedInput-input': {
                                            color: COLORS.white,
                                            bgcolor: COLORS.bg1,
                                            fontFamily: 'Mulish',
                                            fontSize: '16px',
                                            lineHeight: '20px'
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: COLORS.bg1
                                        }
                                    }}
                                    name={item.name}
                                    onChange={handleChangeCreatorInfo}
                                    id={item.label}
                                    placeholder={item.placeholder}
                                    multiline={idx === 4}
                                    rows={3}
                                    variant="outlined"
                                    autoComplete="off"
                                />
                            </Box>
                        ))
                    }
                </FormControl>
            </Box>
            <Box
                sx={{
                    margin: '0 auto',
                    width: isSm ? '90%' : '400px',
                }}
            >
                <CustomDisabledButton
                    disabled={!isFormValid}
                    onClick={handleSubmitCreator}
                    style={{
                        textTransform: 'none',
                        width: '100%',
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                        bgcolor: COLORS.main,
                        height: '48px',
                        borderRadius: '8px',
                        marginBottom: '40px'
                    }} content={'Gửi'} />
            </Box>
            <Dialog
                open={hasError}
                onClose={handleCloseErrorDialog}
                PaperProps={{
                    style: {
                        backgroundColor: COLORS.bg1
                    }
                }}
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: COLORS.white
                        }}
                    >
                        {error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center'),
                        whiteSpace: 'pre-line'
                    }}
                >
                    <Button onClick={handleCloseErrorDialog} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}

export default function BeCreator(props) {
    const { isSm, value } = props;
    return (
        <TabPanel value={value} index={3} children={PanelContent({ isSm })}></TabPanel>
    )
}