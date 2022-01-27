// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';

// import mui components
import {
    Box,
    Typography,
    TextField,
    FormControl,
    Button
} from '@mui/material'

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';


const beCreatorField = [
    {
        label: 'Họ tên*',
        placeholder: 'Nhập họ tên',
    },
    {
        label: 'Số điện thoại*',
        placeholder: 'Nhập số điện thoại',
    },
    {
        label: 'Email*',
        placeholder: 'Nhập email',
    },
    {
        label: 'Liên quan đến*',
        placeholder: 'Liên quan đến',
    },
    {
        label: 'Nội dung*',
        placeholder: 'Nhập nội dung',
    },
]

const PanelContent = (props) => (
    <Box
        sx={{
            ...flexStyle('center', 'flex-start'),
            flexDirection: 'column',
            backgroundColor: COLORS.bg2,
            rowGap: '32px',
            padding: props.isSm ? '16px' : '32px'
        }}>
        <Typography sx={{ ...(props.isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2), color: COLORS.white }}>Trở thành creator</Typography>
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column',
                rowGap: '16px',
                width: '100%',
                padding: props.isSm ? '16px' : '32px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                border: '1px solid #595959'
            }}
        >
            <Typography sx={{ ...TEXT_STYLE.h3, color: COLORS.white }}>Liên hệ với chúng tôi</Typography>
            <Typography sx={{
                ...TEXT_STYLE.content1,
                color: COLORS.contentIcon,
                maxWidth: props.isSm ? '95%' : '77%',
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
                                    ...(props.isSm && { display: 'none' })
                                }}
                            >{item.label}</Typography>
                            <TextField
                                sx={{
                                    width: props.isSm ? '100%' : '85%',
                                    '& .MuiOutlinedInput-input': {
                                        color: props.isSm ? COLORS.placeHolder : COLORS.bg3,
                                        bgcolor: COLORS.bg1,
                                        fontFamily: 'Mulish',
                                        fontSize: '16px',
                                        lineHeight: '20px'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: COLORS.bg1
                                    }
                                }}
                                id={item.label} placeholder={item.placeholder} multiline={idx === 4} rows={3} variant="outlined"
                            />
                        </Box>
                    ))
                }
            </FormControl>
            <Button
                sx={{
                    textTransform: 'none',
                    ...TEXT_STYLE.title1,
                    color: COLORS.white,
                    bgcolor: COLORS.main,
                    width: '400px',
                    height: '48px',
                    borderRadius: '8px',
                    marginTop: '40px'
                }}
            >Gửi</Button>
        </Box>
    </Box >
)

export default function BeCreator(props) {
    const { isSm } = props
    return (
        <TabPanel value={props.value} index={3} children={PanelContent({ isSm })}></TabPanel>
    )
}