// import react
import { useState } from 'react';

// import next router
import { useRouter } from 'next/router';

// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';

//  import react drag drop file
import { FileUploader } from "react-drag-drop-files";

// import qrcode-reader
import QrCode from 'qrcode-reader';

// import mui components
import {
    Box,
    Typography
} from '@mui/material';

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';

const PanelContent = (props) => {
    const { isSm } = props;

    const [parseQRError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useRouter();
    const qr = new QrCode();
    const fileTypes = ['JPG', 'PNG'];

    const handleChange = (file) => {
        if (!/image\/\.*/g.test(file.type)) {
            setError(true);
            setErrorMsg('File upload không đúng định dạng!');
            console.log(errorMsg)
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result;
            try {
                qr.callback = function (error, result) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    const data = result.result;
                    try {
                        const url = new URL(data);
                        navigate.push(url.pathname);
                    }
                    catch (error) {
                        console.log(error);
                        setError(true);
                        setErrorMsg('Đọc dữ liệu từ QRCode không thành công, vui lòng thử lại');
                    }
                }

                qr.decode(result);
            }
            catch (error) {
                console.log(error);
                setError(true);
                setErrorMsg('Đọc dữ liệu từ QRCode không thành công, vui lòng thử lại');
            }
        }
    };

    return (
        <Box
            sx={{
                ...flexStyle('center', 'flex-start'),
                flexDirection: 'column',
                backgroundColor: COLORS.bg2,
                rowGap: isSm ? '24px' : '32px',
                padding: isSm ? '16px' : '32px'
            }}
        >
            <Typography sx={{ ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2), color: COLORS.white }}>Upload mã QR </Typography>
            <FileUploader label="Upload mã QR" handleChange={handleChange} name="file" />
            {
                parseQRError && (
                    <Typography
                        sx={{ ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1), color: COLORS.error }}
                    >{errorMsg}</Typography>
                )
            }
        </Box>
    )
}

export default function HistoryTransaction(props) {
    const { isSm, value } = props;

    return (
        <TabPanel isSm={isSm} value={value} index={4} children={<PanelContent isSm={isSm} />} ></TabPanel>
    )
}