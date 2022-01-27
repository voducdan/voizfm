// import react module
import { useState } from 'react';

// import redux reducer, actions
import { useSelector, useDispatch } from 'react-redux';
import { selectOpenLogin, handleCloseLogin } from '../../redux/openLogin';
import { setToken, removeToken } from '../../redux/token';

// import MUI component
import {
    Box,
    Dialog,
    Typography,
    Divider,
    FormControl,
    Select,
    MenuItem,
    TextField,
    Stack,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

// import others components
import CustomDisabledButton from '../../components/CustomDisabledButton/CustomDisabledButton';

// import icons
import { GreenTick, FacebookButtonIcon, GoogleButtonIcon } from '../../components/Icons/index';

// import utils
import { COLORS, TEXT_STYLE, SCREEN_BREAKPOINTS, COUNTRY_CODES } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { validatePhoneNumber, validateOTP } from '../../utils/validate';
import { flexStyle } from '../../utils/flexStyle';

// import service
import API from '../../services/api';

const flexCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const loginInfo = (content) => (
    <Box key={content} sx={{
        ...flexCenter,
        columnGap: '9px'
    }}>
        <GreenTick />
        <Typography sx={{
            ...TEXT_STYLE.caption12,
            color: COLORS.contentIcon
        }}>{content}</Typography>
    </Box>
);



export default function Login() {
    const api = new API();

    let windowSize = useWindowSize();
    const isSm = windowSize.width > SCREEN_BREAKPOINTS.sm ? false : true;

    const openLogin = useSelector(selectOpenLogin);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isOTPValid, setIsOTPValid] = useState(false);
    const [step, setStep] = useState(1);
    const [countryCode, setCountryCode] = useState('84');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [accessToken, setAccessToken] = useState(null);

    const dispatch = useDispatch();

    const phonePrefixList = COUNTRY_CODES;
    const onClose = () => {
        dispatch(handleCloseLogin());
        setIsPhoneValid(false);
        setIsOTPValid(false);
        setStep(1);
    };
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

    const onOTPChange = (event) => {
        if (validateOTP(event.target.value)) {
            setIsOTPValid(true);
            setOtp(event.target.value);
        }
        else {
            setIsOTPValid(false);
        }
    }

    const onEnterPhone = async () => {
        // Post phone to server here
        try {
            const res = await api.getOTP(phoneNumber, countryCode);
            const data = await res.data;
            if (data.error) {
                setHasError(true);
                setError(data.error);
                return;
            }
            setStep(2);
        }
        catch (err) {
            setHasError(true);
            setError(err.message);
        }
    }

    const onEnterOTP = async () => {
        try {
            const res = await api.loginByPhone(phoneNumber, countryCode, otp);
            const data = await res.data;
            if (data.error) {
                setHasError(true);
                setError(data.error);
                return;
            }
            const user = {
                "first_name": null,
                "last_name": null,
                "birthday": null,
                "avatar_url": null,
                "oauth2": data.data.oauth2,
                "email": null,
                "oauth2_id": data.data.oauth2_id
            }
            const accessToken = data.data.access_token;
            setUserInfo({ ...user });
            setAccessToken(accessToken);
            if (data.data['verification']) {
                dispatch(setToken(accessToken));
                setStep(4);
                return;
            }
            setStep(3);
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

    const handleChangeCountryCode = (e) => {
        setCountryCode(e.target.value);
    }

    const onUpdateProfile = async () => {
        try {
            const res = await api.createProfile(userInfo, accessToken);
            const data = await res.data;
            if (data.error) {
                setHasError(true);
                setError(data.error);
                return;
            }
            setStep(4);
            dispatch(setToken(accessToken));
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

    const handleChangeUserInfo = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let user = { ...userInfo };
        user[name] = value;
        setUserInfo({ ...user });
    }

    const handleCloseErrorDialog = () => {
        setHasError(false);
        setError('');
    }

    return (
        <div>
            <Dialog
                open={openLogin}
                onClose={onClose}
                PaperProps={{
                    style: {
                        backgroundColor: COLORS.bg1,
                        boxShadow: 'none',
                        borderRadius: '30px',
                        margin: 0,
                        width: !isSm ? '512px' : '100%',
                        height: !isSm ? 'auto' : '70%',
                        paddingTop: '40px',
                        paddingBottom: '56px',
                        display: flexCenter.display,
                        alignItems: flexCenter.alignItems
                    }
                }}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: 'center'
                    }
                }}
            >
                <FormControl sx={{
                    backgroundColor: COLORS.bg1,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    ...flexCenter
                }}>
                    <Box sx={{
                        ...flexCenter,
                        flexDirection: 'column',
                        width: '80%',
                        ...(step > 2 && { display: 'none' })
                    }}>
                        <Typography sx={{
                            ...(!isSm ? TEXT_STYLE.h1 : TEXT_STYLE.h2),
                            color: COLORS.white
                        }}>
                            Đăng nhập hoặc đăng ký
                        </Typography>
                        <Box sx={{
                            display: flexCenter.display,
                            alignItems: 'flex-start',
                            justifyContent: flexCenter.justifyContent,
                            rowGap: '10px',
                            flexDirection: 'column',
                            marginTop: '24px',
                            marginBottom: '26px'
                        }}>
                            {
                                [
                                    'Tránh gặp vấn đề về tài khoản khi đổi điện thoại',
                                    'Gợi ý riêng những nội dung phù hợp với sở thích nghe',
                                    'Đồng bộ tài khoản, đăng nhập trên tất cả các thiết bị'
                                ].map(content => (
                                    loginInfo(content)
                                ))
                            }
                        </Box>
                        <Divider sx={{
                            backgroundColor: COLORS.blackStroker,
                            width: '100%'
                        }} />
                        <Box sx={{
                            display: step === 1 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                marginTop: '32px',
                                width: '100%',
                                ...flexCenter,
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
                                    display: flexCenter.display,
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
                                        }} id="phone-number" placeholder="986754523" variant="outlined" onChange={onPhoneChange} />
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
                            <Typography sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                marginBottom: '24px'
                            }}>hoặc tiếp tục với</Typography>
                            <Stack sx={{ width: '100%' }} spacing={3} direction="column">
                                <Button sx={{ textTransform: 'none', height: '48px' }} variant="contained" color="primary" startIcon={<FacebookButtonIcon />}>Facebook</Button>
                                <Button sx={{ textTransform: 'none', height: '48px' }} variant="contained" color="error" startIcon={<GoogleButtonIcon />}>Google</Button>
                            </Stack>
                        </Box>
                        <Box sx={{
                            display: step === 2 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
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
                                }} id="phone-number" placeholder="123456" variant="outlined" onChange={onOTPChange} />
                            <CustomDisabledButton
                                disabled={!isOTPValid}
                                onClick={onEnterOTP}
                                style={{
                                    width: '100%',
                                    textTransform: 'none',
                                    marginBottom: !isSm ? '50px' : '40px',
                                    height: '48px'
                                }} content={'Tiếp tục'} />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: step === 4 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
                            flexDirection: 'column',
                            rowGap: '25px'
                        }}
                    >
                        <img src="/images/login_success.png" alt="login success img" />
                        <Typography sx={{
                            ...(!isSm ? TEXT_STYLE.h2 : TEXT_STYLE.h3),
                            color: COLORS.white,
                        }}>Chúc mừng bạn!</Typography>
                        <Typography sx={{
                            ...(!isSm ? TEXT_STYLE.content1 : TEXT_STYLE.content2),
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            width: '277px'
                        }}>Bạn đã đăng nhập thành công,
                            hãy trải nghiệm ứng dụng ngay bây giờ </Typography>
                    </Box>
                </FormControl>
                <FormControl
                    sx={{
                        display: step === 3 ? flexCenter.display : 'none',
                        width: isSm ? '100%' : '80%',
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column',
                        rowGap: '24px',
                        marginTop: '32px',
                        paddingBottom: '48px'
                    }}
                >
                    <Box
                        sx={{
                            display: step === 3 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
                            flexDirection: 'column',
                        }}>
                        <Box sx={{
                            marginTop: '32px',
                            width: '100%',
                            ...flexCenter,
                            flexDirection: 'column',
                            rowGap: '24px',
                            marginBottom: '24px',
                        }}>
                            <Typography sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                            }}>Cập nhật thông tin cá nhân</Typography>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: flexCenter.display,
                                    flexDirection: 'column',
                                    rowGap: '10px'
                                }}
                            >
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
                                    name='first_name'
                                    onChange={handleChangeUserInfo}
                                    placeholder="Họ tên lót"
                                />
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
                                    name='last_name'
                                    onChange={handleChangeUserInfo}
                                    placeholder="Tên"
                                />
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
                                    placeholder="Ngày sinh"
                                    name='birthday'
                                    onChange={handleChangeUserInfo}
                                />
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
                                    placeholder="Avatar url"
                                    name='avatar_url'
                                    onChange={handleChangeUserInfo}
                                />
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
                                    name='email'
                                    onChange={handleChangeUserInfo}
                                    placeholder="Email"
                                />
                            </Box>
                            <Button
                                onClick={onUpdateProfile}
                                sx={{
                                    width: '100%',
                                    textTransform: 'none',
                                    marginBottom: !isSm ? '20px' : '30px',
                                    height: '48px',
                                    ...(!isSm ? TEXT_STYLE.title1 : TEXT_STYLE.title2),
                                }}
                            >
                                Tiếp tục
                            </Button>
                        </Box>
                    </Box>
                </FormControl>
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
                            'whiteSpace': 'pre-line'
                        }}
                    >
                        <Button onClick={handleCloseErrorDialog} autoFocus>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </div >
    )
}