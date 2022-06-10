// import react module
import { useState, useEffect } from 'react';

// import next router
import { useRouter } from 'next/router';

// import universal cookie
import Cookies from 'universal-cookie';

// import redux reducer, actions
import { useSelector, useDispatch } from 'react-redux';
import { selectOpenLogin, handleCloseLogin, setOpenLogin } from '../../redux/openLogin';
import { setToken } from '../../redux/token';

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
    IconButton,
    DialogContent,
    DialogContentText,
    DialogActions,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// import login third party
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';

// import others components
import CustomDisabledButton from '../../components/CustomDisabledButton/CustomDisabledButton';

// import icons
import { GreenTick, FacebookButtonIcon, GoogleButtonIcon, Account, Email } from '../../components/Icons/index';

// import utils
import { COLORS, TEXT_STYLE, SCREEN_BREAKPOINTS, COUNTRY_CODES } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { validatePhoneNumber, validateOTP } from '../../utils/validate';
import { flexStyle } from '../../utils/flexStyle';

// import services
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
        borderRadius: '4px',
        border: `1px solid ${COLORS.blackStroker}`
    }
}

// List steps
// 1. Login by phone
// 2. Enter opt for phone login
// 3. Update user info when login by phone
// 4. Login by phone success
// 5. Update phone number when login social

export default function Login() {
    const api = new API();
    const cookies = new Cookies();

    const navigate = useRouter();

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
    const [uuid, setUuid] = useState(null);
    const [isGoogle, setIsGoogle] = useState(false);
    const [isFacebook, setIsFacebook] = useState(false);
    const [otpCountDown, setOtpCountDown] = useState('');
    const [isOTPWrong, setIsOTPWrong] = useState(false);
    const [otpRetries, setOtpRetries] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [isUserInforValidated, setIsUserInforValidated] = useState(false);
    const [isWaitFormRenewOtp, setIsWaitFormRenewOtp] = useState(false);

    const dispatch = useDispatch();

    const phonePrefixList = COUNTRY_CODES;

    useEffect(() => {
        if (!userInfo['email'] || !userInfo['first_name'] || !userInfo['last_name']) {
            setIsUserInforValidated(false);
            return;
        }
        setIsUserInforValidated(true);

    }, [userInfo]);

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
        setIsWaitFormRenewOtp(false);
        try {
            const res = await api.getOTP(phoneNumber, countryCode);
            const data = await res.data;
            if (data.error) {
                setHasError(true);
                setError(data.error);
                return;
            }
            setStep(2);
            let start = 59;
            const x = setInterval(() => {
                setOtpCountDown(`00:${start < 10 ? '0' + start : start}`);
                start -= 1;
                if (start === -1) {
                    setIsOTPWrong(false);
                    setOtpRetries(0);
                    clearInterval(x);
                    setOtpCountDown('');
                    setIsWaitFormRenewOtp(true);
                }
            }, 1000);
            setIntervalId(x);
        }
        catch (err) {
            setHasError(true);
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setError(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                return;
            }
            setError(errList);
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
                cookies.set('token', accessToken);
                setStep(4);
                return;
            }
            if (isGoogle || isFacebook) {
                handleSkipPhone();
                return;
            }
            setStep(3);
        }
        catch (err) {
            setIsOTPWrong(true);
            setOtpRetries(otpRetries + 1);
            if (otpRetries === 2) {
                dispatch(setOpenLogin(false));
                setStep(1);
                setIsOTPWrong(false);
                setOtpRetries(0);
                setOtpCountDown('');
                clearInterval(intervalId);
            }
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
            cookies.set('token', accessToken);
        }
        catch (err) {
            setHasError(true);
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${key ? key.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()) : ''} ${value} \n`
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

    const responseFacebook = async (response) => {
        try {
            const { name } = response;
            const splitedName = name.split(' ');
            const payload = {
                "first_name": splitedName.slice(0, 1).join(),
                "last_name": splitedName.slice(1).join(' '),
                "email": response.email,
                "birthday": response.birthday || null,
                "oauth2_id": response.userID,
                "avatar_url": response.picture.data.url
            }
            const res = await api.loginFacebook(payload);
            const data = await res.data;
            setAccessToken(data.data.access_token);
            if (data.verification || phoneNumber) {
                try {
                    await api.verifyAccount({ 'uuid': data.data.uuid });
                }
                catch (err) {
                    console.log(err)
                }
                dispatch(setToken(accessToken));
                cookies.set('token', accessToken);
                setStep(null);
                dispatch(handleCloseLogin());
                return;
            }
            setUuid(data.data.uuid);
            setStep(5);
            setIsFacebook(true);
        }
        catch (err) {
            setHasError(true);
            setError('Đã xảy ra lỗi khi đăng nhập bằng Facebook, vui lòng thử lại sau!');
            return;
        }
    }
    const responseGoogleSuccess = async (response) => {
        try {
            console.log(response)
            const { profileObj, googleId } = response;
            const payload = {
                "first_name": profileObj.givenName,
                "last_name": profileObj.familyName,
                "email": profileObj.email,
                "birthday": profileObj.birthday || null,
                "oauth2_id": googleId,
                "avatar_url": profileObj.imageUrl
            }
            const res = await api.loginGoogle(payload);
            const data = await res.data;
            setAccessToken(data.data.access_token);
            if (data.verification || phoneNumber) {
                try {
                    await api.verifyAccount({ 'uuid': data.data.uuid });
                }
                catch (err) {
                    console.log(err)
                }
                dispatch(setToken(accessToken));
                cookies.set('token', accessToken);
                setStep(null);
                dispatch(handleCloseLogin());
                return;
            }
            setUuid(data.data.uuid);
            setStep(5);
            setIsGoogle(true);
        }
        catch (err) {
            const errList = err.response.data.error || '';
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setHasError(true);
                setError(errMessage);
                return;
            }
            setHasError(true);
            setError(errList);
        }
    }

    const responseGoogleFalure = (err) => {
        console.log(err)
        setHasError(true);
        setError('Đã xảy ra lỗi khi đăng nhập bằng google, vui lòng thử lại sau!');
        return;
    }

    const handleSkipPhone = async () => {
        try {
            await api.verifyAccount({ 'uuid': uuid });
        }
        catch (err) {
            console.log(err)
        }
        dispatch(setToken(accessToken));
        cookies.set('token', accessToken);
        setStep(null);
        dispatch(handleCloseLogin());
    }

    const handleReviewOtp = () => {
        if (!otpCountDown) {
            onEnterPhone();
        }

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
                        paddingTop: isSm ? '51px' : '40px',
                        paddingBottom: isSm ? '65px' : '58px',
                        boxSizing: 'border-box',
                        display: flexCenter.display,
                        alignItems: flexCenter.alignItems,
                        scrollbarGutter: 'stable'
                    }
                }}
                sx={{
                    '& .MuiDialog-container': {
                        alignItems: isSm ? 'flex-end' : 'center'
                    },
                    '& .MuiDialog-paper': {
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
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 0,
                        color: COLORS.white
                    }}
                >
                    <CloseIcon />
                </IconButton>
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
                        <Box
                            sx={{
                                display: step === 1 ? flexCenter.display : 'none',
                                alignItems: flexCenter.alignItems,
                                flexDirection: 'column',
                            }}
                        >
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
                                        }}
                                        id="phone-number"
                                        placeholder="987654321"
                                        variant="outlined"
                                        autoComplete="off"
                                        onChange={onPhoneChange} />
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
                                <FacebookLogin
                                    render={renderProps => (
                                        <Button
                                            onClick={renderProps.onClick}
                                            sx={{ textTransform: 'none', height: '48px' }}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<FacebookButtonIcon />}>
                                            Facebook
                                        </Button>

                                    )}
                                    appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    callback={responseFacebook} />
                                <GoogleLogin
                                    render={renderProps => (
                                        <Button
                                            onClick={renderProps.onClick}
                                            sx={{
                                                textTransform: 'none',
                                                height: '48px'
                                            }}
                                            variant="contained"
                                            color="error"
                                            startIcon={<GoogleButtonIcon />}>
                                            Google
                                        </Button>

                                    )}
                                    cookiePolicy={'single_host_origin'}
                                    clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
                                    onSuccess={responseGoogleSuccess}
                                    onFailure={responseGoogleFalure}
                                />
                            </Stack >
                        </Box >
                        <Box sx={{
                            display: step === 2 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
                            flexDirection: 'column',
                        }}>
                            <Typography sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                mt: '32px',
                                mb: '25px'
                            }}>Nhập mã số gồm 6 chữ số đã gửi tới</Typography>
                            <TextField
                                sx={{
                                    borderRadius: '4px',
                                    border: '1px solid #353535',
                                    justifyContent: 'center',
                                    height: '49px',
                                    ...(isOTPWrong && {
                                        '& .Mui-focused': {
                                            border: `1px solid ${COLORS.error}`
                                        }
                                    }),
                                    '& .MuiOutlinedInput-root': {
                                        height: '100%'
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: COLORS.white,
                                        ...(!isSm ? TEXT_STYLE.h2 : TEXT_STYLE.h3),
                                        textAlign: 'center'
                                    }
                                }}
                                id="phone-number"
                                placeholder="123456"
                                variant="outlined"
                                autoComplete="off"
                                onChange={onOTPChange}
                            />
                            {
                                isOTPWrong && (
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content2,
                                            mt: '6px',
                                            color: COLORS.error
                                        }}
                                    >

                                        Mã không đúng, bạn còn {3 - otpRetries} lần thử
                                    </Typography>
                                )
                            }
                            <Typography
                                onClick={handleReviewOtp}
                                sx={{
                                    ...TEXT_STYLE.title2,
                                    mt: isOTPWrong ? '12px' : '40px',
                                    color: COLORS.bg4,
                                    cursor: 'pointer'
                                }}
                            >
                                {isWaitFormRenewOtp ? 'Yêu cầu mã mới' : otpCountDown ? `Yêu cầu mã mới trong ${otpCountDown}` : ''}
                            </Typography>
                            <CustomDisabledButton
                                disabled={!isOTPValid}
                                onClick={onEnterOTP}
                                style={{
                                    width: '100%',
                                    textTransform: 'none',
                                    marginBottom: !isSm ? '50px' : '40px',
                                    height: '48px',
                                    mt: '16px',
                                }} content={'Tiếp tục'} />
                        </Box>
                    </Box >
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
                </FormControl >
                <FormControl
                    sx={{
                        display: step === 3 ? flexCenter.display : 'none',
                        width: '100%',
                        ...flexStyle('center', 'center')
                    }}
                >
                    <Box
                        sx={{
                            display: step === 3 ? flexCenter.display : 'none',
                            alignItems: flexCenter.alignItems,
                            flexDirection: 'column',
                            p: isSm ? '46px 38px 64px 38px' : '51px 56px 58px 56px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                        <Box
                            sx={{
                                width: '100%',
                                ...flexCenter,
                                flexDirection: 'column'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    textAlign: 'center'
                                }}
                            >Bạn đã đăng ký tài khoản thành công!<br />Điền thông tin để hoàn tất</Typography>
                            <Box
                                sx={{
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    rowGap: '23px',
                                    mt: '32px'
                                }}
                            >
                                <Box
                                    sx={{
                                        ...flexStyle('center', 'center'),
                                        columnGap: isSm ? '8px' : '16px',
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
                                        name='first_name'
                                        onChange={handleChangeUserInfo}
                                        value={userInfo.first_name || ''}
                                        placeholder="Họ"
                                        variant="outlined"
                                        autoComplete="off"
                                    />
                                    <TextField
                                        sx={{
                                            ...textFieldStyle
                                        }}
                                        name='last_name'
                                        onChange={handleChangeUserInfo}
                                        value={userInfo.last_name || ''}
                                        placeholder="Tên"
                                        variant="outlined"
                                        autoComplete="off"
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
                                        value={userInfo.email || ''}
                                        placeholder="Địa chỉ email"
                                        variant="outlined"
                                        autoComplete="off"
                                    />
                                </Box>
                            </Box>
                            <CustomDisabledButton
                                onClick={onUpdateProfile}
                                disabled={!isUserInforValidated}
                                style={{
                                    width: '100%',
                                    textTransform: 'none',
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    bgcolor: COLORS.main,
                                    height: '48px',
                                    borderRadius: '8px',
                                    mt: '24px',
                                    mb: '8px'
                                }}
                                content='Tiếp tục'
                            />
                        </Box>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: '#DEDEDE'
                            }}
                        >
                            Tham khảo <a
                                target='_blank'
                                href='https://voiz.vn/chinh-sach-bao-mat'
                                style={{
                                    color: '#DEDEDE'
                                }}
                            >
                                chính sách bảo mật &nbsp;
                            </a>
                            của chúng tôi
                        </Typography>
                        <Typography sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            mb: '24px',
                            mt: '25px'
                        }}>hoặc tiếp tục với</Typography>
                        <Stack sx={{ width: '100%' }} spacing={3} direction="column">
                            <FacebookLogin
                                render={renderProps => (
                                    <Button
                                        onClick={renderProps.onClick}
                                        sx={{ textTransform: 'none', height: '48px' }}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<FacebookButtonIcon />}>
                                        Facebook
                                    </Button>

                                )}
                                appId={`${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook} />
                            <GoogleLogin
                                render={renderProps => (
                                    <Button
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        sx={{
                                            textTransform: 'none',
                                            height: '48px'
                                        }}
                                        variant="contained"
                                        color="error"
                                        startIcon={<GoogleButtonIcon />}>
                                        Google
                                    </Button>

                                )}
                                cookiePolicy={'single_host_origin'}
                                clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
                                buttonText="Google"
                                onSuccess={responseGoogleSuccess}
                                onFailure={responseGoogleFalure}
                            />
                        </Stack >
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
                <Dialog
                    open={step === 5}
                    onClose={handleSkipPhone}
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: COLORS.bg1,
                            ...flexStyle('center', 'center'),
                            borderRadius: isSm ? 0 : '30px',
                            width: isSm ? '100%' : '512px',
                            margin: 0,
                            position: 'relative',
                            p: isSm ? '0 38px' : '0 56px',
                            boxSizing: 'border-box'
                        }
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleSkipPhone}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 0,
                            color: COLORS.white
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent
                        sx={{
                            width: '100%',
                            ...flexStyle('center', 'center'),
                            p: 0
                        }}
                    >
                        <Box sx={{
                            marginTop: '32px',
                            width: '100%',
                            ...flexStyle('center', 'center'),
                            flexDirection: 'column',
                            marginBottom: '24px',
                        }}>
                            <Typography sx={{
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                            }}>Nhập số điện thoại của bạn để tiếp tục</Typography>
                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'center'),
                                    columnGap: '11px',
                                    mt: '24px',
                                    mb: '34px'
                                }}
                            >
                                <GreenTick />
                                <Typography sx={{
                                    ...TEXT_STYLE.caption12,
                                    color: COLORS.contentIcon
                                }}>Tránh gặp vấn đề về tài khoản khi đổi điện thoại</Typography>
                            </Box>
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
                                    }} id="phone-number"
                                    placeholder="987654321"
                                    variant="outlined"
                                    autoComplete="off"
                                    onChange={onPhoneChange}
                                />
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            'whiteSpace': 'pre-line',
                            ...flexStyle('center', 'center'),
                            flexDirection: 'column',
                            width: '100%',
                            p: 0
                        }}
                    >
                        <CustomDisabledButton
                            disabled={!isPhoneValid}
                            onClick={onEnterPhone}
                            style={{
                                width: '100%',
                                textTransform: 'none',
                                marginBottom: !isSm ? '20px' : '30px',
                                height: '48px',
                                ...(!isSm ? TEXT_STYLE.title1 : TEXT_STYLE.title2),
                                borderRadius: '8px'
                            }}
                            content={'Tiếp tục'}
                        />
                        <Button
                            onClick={handleSkipPhone}
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                textTransform: 'none',
                                mb: '39px'
                            }}
                        >
                            Bỏ qua
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog >
        </div >
    )
}