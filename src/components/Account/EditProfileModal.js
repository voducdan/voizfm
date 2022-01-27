// import react
import { useState, useEffect, useRef } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import redux action
import { selectUser, setUser } from '../../redux/user';

// import mui components
import { styled } from '@mui/material/styles';
import {
    Typography,
    Dialog,
    Box,
    IconButton,
    Button,
    Avatar,
    FormControl,
    TextField,
    InputAdornment,
    DialogContent,
    DialogContentText,
    DialogActions,
    Select,
    MenuItem
} from '@mui/material';
import {
    DesktopDatePicker,
    LocalizationProvider
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';

// import others components
import CustomDisabledButton from '../../components/CustomDisabledButton/CustomDisabledButton';

// import icons
import { Pencil, Birthday, Account, Mobile, Email } from '../Icons';

// import date-fns
import { format } from 'date-fns'

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE, SCREEN_BREAKPOINTS, COUNTRY_CODES } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { validatePhoneNumber, validateOTP } from '../../utils/validate';

// import services
import API from '../../services/api'

const textFieldStyle = {
    width: '100%',
    '& .MuiOutlinedInput-input': {
        bgcolor: COLORS.bg2,
        color: COLORS.white,
        ...TEXT_STYLE.content1,
        height: '50px',
        boxSizing: 'border-box'
    },
    '& .MuiOutlinedInput-root': {
        bgcolor: COLORS.bg2,
    }
}

const Input = styled('input')({
    display: 'none',
});

export default function EditProfileModal(props) {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm;
    const accountData = useSelector(selectUser);
    const [userInfo, setUserInfo] = useState({});
    const [avatarFilename, setAvatarFilename] = useState('');
    const [updatedInfoMessage, setUpdatedInfoMessage] = useState('');
    const [openUpdateInfoResultModal, setOpenUpdateInfoResultModal] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isOTPValid, setIsOTPValid] = useState(false);
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [step, setStep] = useState(0);
    const [countryCode, setCountryCode] = useState('84');
    const dispatch = useDispatch();
    const fileInput = useRef(null);
    const phonePrefixList = COUNTRY_CODES;

    useEffect(() => {
        const user = {
            firstName: accountData?.first_name || "first_name",
            lastName: accountData?.last_name || "last_name",
            email: accountData?.email,
            birthday: accountData?.birthday || format(new Date(), 'yyyy-MM-dd'),
            avatarUrl: accountData?.avatar?.original_url,
        };
        const tmpPhoneNumber = accountData?.phone_number || '';
        setUserInfo(user);
        setPhoneNumber(tmpPhoneNumber);
    }, [accountData])

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleChangeUserInfo = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let user = { ...userInfo };
        user[name] = value;
        setUserInfo({ ...user });
    }

    const handleChangeBirthday = (birthday) => {
        const formatedBirthday = format(new Date(birthday), 'yyyy-MM-dd');
        let user = { ...userInfo };
        user['birthday'] = formatedBirthday;
        setUserInfo({ ...user });
    }

    const handleSubmitEditProfile = () => {
        requestApiToUpdateProfile();
    }

    const handleSelectAvatar = (e) => {
        const file = e.target.files[0];
        if (!/image\/\.*/g.test(file.type)) {
            return;
        }
        const filename = file.name;
        setAvatarFilename(filename);
    }

    const handleChangeCountryCode = (e) => {
        setCountryCode(e.target.value);
    }

    const onOTPChange = (event) => {
        if (validateOTP(event.target.value)) {
            setIsOTPValid(true);
            setOtp(event.target.value);
        }
        else {
            setIsOTPValid(false);
        }
    }

    const onPhoneChange = (event) => {
        const value = event.target.value
        if (validatePhoneNumber(value)) {
            setIsPhoneValid(true);
            setPhoneNumber(value);
        }
        else {
            setIsPhoneValid(false);
        }
    }

    const handleSubmitOtp = async () => {
        try {
            const res = await api.updatePhoneNumber(phoneNumber, countryCode, otp);
            const data = await res.data;
            if (data.error) {
                setUpdatedInfoMessage(data.error);
                setOpenUpdateInfoResultModal(true);
                return;
            }
            setStep(0);
            setPhoneNumber(data.data.phone_number);
            setUpdatedInfoMessage('Cập nhật số điện thoại thành công!');
            setOpenUpdateInfoResultModal(true);
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
                setUpdatedInfoMessage(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                setOpenUpdateInfoResultModal(true);
                return;
            }
            setUpdatedInfoMessage(errList);
            setOpenUpdateInfoResultModal(true);
        }
    }

    const onEnterPhone = async () => {
        try {
            const res = await api.getOTPOnUpdateProfile(phoneNumber, countryCode);
            const data = await res.data;
            if (data.error) {
                setUpdatedInfoMessage(data.error);
                setOpenUpdateInfoResultModal(true);
                return;
            }
            setStep(2);
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
                setUpdatedInfoMessage(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                setOpenUpdateInfoResultModal(true);
                return;
            }
            setUpdatedInfoMessage(errList);
            setOpenUpdateInfoResultModal(true);
        }
    }

    const requestApiToUpdateProfile = async () => {
        const userFormData = new FormData();
        if (fileInput.current.files[0]) {
            userFormData.append('avatar', fileInput.current.files[0]);
        }
        userFormData.append('first_name', userInfo.firstName);
        userFormData.append('last_name', userInfo.lastName);
        userFormData.append('email', userInfo.email);
        userFormData.append('birthday', userInfo.birthday);
        userFormData.append('avatar_url', userInfo.avatarUrl);
        try {
            const res = await api.updateUserInfo(userFormData);
            const data = await res.data;
            setOpenUpdateInfoResultModal(true);
            if (data.error) {
                setUpdatedInfoMessage(data.error);
                return;
            }
            setUpdatedInfoMessage('Đã cập nhật thông tin trên hệ thống!');
            dispatch(setUser(data.data));
        }
        catch (err) {
            setUpdatedInfoMessage('Cập nhật thông tin không thành công!');
            setOpenUpdateInfoResultModal(true);
        }
    }

    return (
        < Dialog
            sx={{
                left: '50%',
                width: isSm ? '100%' : '920px',
                transform: 'translateX(-50%)',
                '& .MuiDialog-paper': {
                    bgcolor: COLORS.bg1,
                    maxWidth: '100%',
                    width: '100%',
                    margin: 0
                }

            }}
            open={props.open}
            onClose={handleClose}
        >
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: COLORS.white,
                    bgcolor: COLORS.bg2
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box
                sx={{
                    ...flexStyle('flex-start', 'center'),
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: '40px 16px 20px 16px',
                    boxSizing: 'border-box'
                }}
            >
                <Typography
                    sx={{
                        ...(isSm ? TEXT_STYLE.h2 : TEXT_STYLE.h1),
                        color: COLORS.white
                    }}
                >
                    Thay đổi thông tin cá nhân
                </Typography>

                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column',
                        rowGap: '55px',
                        borderTop: `1px solid ${COLORS.blackStroker}`,
                        margin: '32px 0',
                        paddingTop: '32px',
                        boxSizing: 'border-box'

                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('space-between', 'center'),
                            width: '100%'
                        }}
                    >
                        <Typography sx={{
                            ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                            color: COLORS.white
                        }}>Ảnh đại diện</Typography>
                        <label htmlFor="contained-button-file">
                            <Input
                                ref={fileInput}
                                onChange={handleSelectAvatar}
                                accept="image/*"
                                id="contained-button-file"
                                type="file"
                            />
                            <Button
                                sx={{
                                    bgcolor: COLORS.bg2,
                                    color: COLORS.contentIcon,
                                    textTransform: 'none',
                                    ...TEXT_STYLE.title2
                                }}
                                startIcon={<Pencil />}
                                component="span"
                            >Chỉnh sửa</Button>
                            <Typography
                                sx={{
                                    color: COLORS.contentIcon,
                                    ...TEXT_STYLE.title2
                                }}
                            >{avatarFilename}</Typography>
                        </label>
                    </Box>
                    <Box>
                        <Avatar
                            sx={{
                                width: isSm ? '140px' : '210px',
                                height: isSm ? '140px' : '210px'
                            }}
                            alt="Remy Sharp"
                            src={accountData?.avatar?.thumb_url}
                        />
                    </Box>
                </Box>
                <FormControl
                    sx={{
                        width: isSm ? '100%' : '80%',
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column',
                        rowGap: '24px',
                        marginTop: '32px',
                        paddingBottom: '48px',
                        borderBottom: `1px solid ${COLORS.blackStroker}`
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '24px',
                            width: '100%'
                        }}
                    >
                        <TextField
                            sx={{
                                ...textFieldStyle
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Account />
                                    </InputAdornment>
                                ),
                            }}
                            name='firstName'
                            onChange={handleChangeUserInfo}
                            value={userInfo.firstName}
                            placeholder="Họ tên lót" variant="outlined"
                        />
                        <TextField
                            sx={{
                                ...textFieldStyle
                            }}
                            name='lastName'
                            onChange={handleChangeUserInfo}
                            value={userInfo.lastName}
                            placeholder="Tên" variant="outlined"
                        />
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            width: '100%'
                        }}
                    >
                        <TextField
                            sx={{
                                width: '100%',
                                ...textFieldStyle
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                            name='email'
                            onChange={handleChangeUserInfo}
                            value={userInfo.email}
                            placeholder="Địa chỉ email" variant="outlined"
                        />
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            width: '100%'
                        }}
                    >
                        <TextField
                            sx={{
                                width: '100%',
                                ...textFieldStyle
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mobile />
                                    </InputAdornment>
                                ),
                            }}
                            onClick={() => { setStep(1) }}
                            name='phoneNumber'
                            value={phoneNumber}
                            placeholder="Số điện thoại" variant="outlined"
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            value={userInfo.birthday}
                            onChange={handleChangeBirthday}
                            InputAdornmentProps={{
                                position: 'start'
                            }}
                            components={{
                                OpenPickerIcon: Birthday
                            }}

                            renderInput={({ inputRef, inputProps, InputProps }) => {
                                return (
                                    <Box
                                        sx={{
                                            ...flexStyle('center', 'center'),
                                            width: '100%'
                                        }}
                                    >
                                        <TextField
                                            sx={{
                                                width: '100%',
                                                ...textFieldStyle,
                                                '& .MuiButtonBase-root': {
                                                    p: 0,
                                                    ml: 0
                                                }
                                            }}
                                            ref={inputRef}
                                            InputProps={{
                                                startAdornment: InputProps?.startAdornment
                                            }}
                                            name='birthday'
                                            value={userInfo.birthday}
                                            placeholder="Ngày tháng năm sinh" variant="outlined"
                                        />
                                    </Box>
                                )
                            }}
                        />

                    </LocalizationProvider>

                </FormControl>
                <Button
                    sx={{
                        textTransform: 'none',
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                        bgcolor: COLORS.main,
                        width: isSm ? '100%' : '50%',
                        height: '48px',
                        borderRadius: '8px',
                        margin: '21px 0'
                    }}
                    onClick={handleSubmitEditProfile}
                >Lưu</Button>
            </Box>
            <Dialog

                sx={{
                    '& .MuiDialog-paper': {
                        bgcolor: COLORS.bg1
                    }
                }}
                open={openUpdateInfoResultModal}
                onClose={() => { setOpenUpdateInfoResultModal(false); setUpdatedInfoMessage('') }}
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            color: COLORS.white
                        }}
                    >
                        {updatedInfoMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenUpdateInfoResultModal(false); setUpdatedInfoMessage('') }}>Đóng</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        bgcolor: COLORS.bg1,
                        ...flexStyle('center', 'center')
                    }
                }}
                open={step === 2}
                onClose={() => { setStep(0); setUpdatedInfoMessage('') }}
            >
                <Box sx={{
                    width: '80%',
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    rowGap: '25px'
                }}>
                    <Typography sx={{
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                        mt: '32px'
                    }}>Nhập mã số gồm 6 chữ số đã gửi tới</Typography>
                    <TextField
                        sx={{
                            borderRadius: '4px',
                            border: '1px solid #353535',
                            justifyContent: 'center',
                            height: '49px',
                            '& .MuiOutlinedInput-root': {
                                height: '100%'
                            },
                            '& .MuiOutlinedInput-input': {
                                color: COLORS.white,
                                ...(!isSm ? TEXT_STYLE.h2 : TEXT_STYLE.h3)
                            }
                        }}
                        placeholder="123456"
                        variant="outlined"
                        onChange={onOTPChange}
                    />
                    <CustomDisabledButton
                        disabled={!isOTPValid}
                        onClick={handleSubmitOtp}
                        style={{
                            width: '100%',
                            textTransform: 'none',
                            marginBottom: !isSm ? '50px' : '40px',
                            height: '48px'
                        }} content={'Tiếp tục'} />
                </Box>
            </Dialog>
            <Dialog
                sx={{
                    '& .MuiDialog-paper': {
                        bgcolor: COLORS.bg1,
                        ...flexStyle('center', 'center')
                    }
                }}
                open={step === 1}
                onClose={() => { setStep(0); setUpdatedInfoMessage('') }}
            >
                <Box sx={{
                    marginTop: '32px',
                    width: '80%',
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    rowGap: '24px',
                    marginBottom: '24px',
                }}>
                    <Typography sx={{
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                    }}>Nhập số điện thoại của bạn để tiếp tục</Typography>
                    <Box sx={{
                        width: '100%',
                        ...flexStyle('center', 'center'),
                        columnGap: '16px',
                        height: '49px'
                    }}>
                        <Select
                            id="select-phone-prefix"
                            value={countryCode}
                            onChange={handleChangeCountryCode}
                            label="countryCode"
                            sx={{
                                border: '1px solid #353535',
                                borderRadius: '4px',
                                color: COLORS.white,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: "none"
                                },
                                '& .MuiSelect-icon': {
                                    color: COLORS.white
                                }
                            }}
                        >
                            {
                                phonePrefixList.map((prefix, idx) => (
                                    <MenuItem key={idx} value={prefix}>+{prefix}</MenuItem>
                                ))
                            }
                        </Select>
                        <TextField
                            sx={{
                                borderRadius: '4px',
                                border: '1px solid #353535',
                                justifyContent: 'center',
                                height: '100%',
                                '& .MuiOutlinedInput-root': {
                                    height: '100%'
                                },
                                '& .MuiOutlinedInput-input': {
                                    color: COLORS.white,
                                    ...(!isSm ? TEXT_STYLE.h2 : TEXT_STYLE.h3)
                                }
                            }}
                            placeholder="986754523"
                            variant="outlined"
                            onChange={onPhoneChange}
                        />
                    </Box>
                    <CustomDisabledButton
                        disabled={!isPhoneValid}
                        onClick={onEnterPhone}
                        style={{
                            width: '100%',
                            textTransform: 'none',
                            marginBottom: !isSm ? '20px' : '30px',
                            height: '48px',
                            ...(!isSm ? TEXT_STYLE.title1 : TEXT_STYLE.title2),
                        }} content={'Tiếp tục'} />
                </Box>
            </Dialog>
        </Dialog>
    )
}