// import next link
import Link from 'next/link';

// import MUI components
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

const questionsList = [
    {
        id: 1,
        question: 'Phải làm gì nếu sau khi thanh toán vẫn không nghe được nội dung?',
        answer: 'Bạn có thể thử tắt ứng dụng và mở lại. Trong một số trường hợp, giao dịch có thể bị trục trặc từ phía Ngân hàng, khi ấy bạn hãy liên hệ trực tiếp với Voiz để được hỗ trợ nhanh chóng nhất.'
    },
    {
        id: 2,
        question: 'Hội viên VIP có thể được nghe những nội dung nào?',
        answer: 'Khi trở thành hội viên VIP, bạn sẽ được nghe và tải không giới hạn những tựa sách chất lượng cao, với biểu tượng VIP được gắn trên bìa sách. Ngoài ra, hội viên VIP còn được ưu đãi 10% khi mua sách theo từng quyển lẻ và nhận được nhiều quà tặng khác trong quá trình sử dụng ứng dụng. Gói thành viên đã mua sẽ không được đổi trả dưới mọi hình thức, xin vui lòng đọc kỹ các điều khoản hướng dẫn sử dụng trước khi giao dịch.'
    },
    {
        id: 3,
        question: 'Làm thế nào để có thể thanh toán được gói Hội viên VIP?',
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
    {
        id: 4,
        question: 'Một tài khoản VIP có thể được sử dụng bởi bao nhiêu người?',
        answer: 'Một tài khoản VIP chỉ có thể được đăng nhập và sử dụng bởi một người dùng duy nhất, cần tránh chia sẻ thông tin tài khoản để không ảnh hưởng tới vấn đề bảo mật.'
    },
    {
        id: 5,
        question: 'Chất lượng Sách nói của Voiz như thế nào?',
        answer: 'Voiz hợp tác với các đơn vị uy tín như NXB Kim Đồng,NXB Văn học, First News, PACE, Nhã Nam... cùng đội ngũ diễn viên lồng tiếng nhiều kinh nghiệm để mang lại những nội dung Sách nói Chất lượng cao và 100% Bản quyền.'
    },
]

export default function FAQ() {
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    return (
        <Box>
            <Box
                sx={{
                    bgcolor: COLORS.bg2,
                    pb: '32px',
                    boxSizing: 'border-box'
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            textAlign: 'center',
                            pt: isSm ? '33px' : '80px'
                        }}
                    >
                        Thắc mắc thường gặp
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        padding: isSm ? 0 : '0 159px',
                        boxSizing: 'border-box',
                        mt: isSm ? '52px' : '80px'
                    }}
                >
                    {
                        questionsList.map(item => (
                            <Accordion
                                key={item.id}
                                sx={{
                                    bgcolor: COLORS.bg2,
                                    position: 'inherit',
                                    boxShadow: 'none',
                                    minHeight: isSm ? '80px' : '66px',
                                    '& .Mui-expanded': {
                                        bgcolor: COLORS.bg1,
                                        borderTopLeftRadius: '10px',
                                        borderTopRightRadius: '10px'
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: COLORS.white }} />}
                                    aria-controls="panel1a-content"
                                    id={item.id}
                                >
                                    <Typography
                                        sx={{
                                            ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                            color: COLORS.white
                                        }}
                                    >{item.id}. {item.question}</Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        bgcolor: COLORS.bg1,
                                        borderBottomLeftRadius: '10px',
                                        borderBottomRightRadius: '10px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content1,
                                            color: COLORS.VZ_Text_content
                                        }}
                                    >
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    }
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    p: isSm ? '32px 16px 0 16px' : '32px 160px 0 160px',
                    boxSizing: 'border-box',
                    ...flexStyle('space-between', 'center')
                }}
            >
                <Link
                    href="https://voiz.vn/chinh-sach-bao-mat"
                >
                    <a
                        target='_blank'
                        style={{
                            ...(isSm ? TEXT_STYLE.caption10Bold : TEXT_STYLE.content1),
                            color: COLORS.bg4
                        }}
                    >
                        Chính sách bảo mật
                    </a>
                </Link>
                <Link

                    href="https://voiz.vn/dieu-khoan-su-dung"
                >
                    <a
                        target='_blank'
                        style={{
                            ...(isSm ? TEXT_STYLE.caption10Bold : TEXT_STYLE.content1),
                            color: COLORS.bg4
                        }}
                    >
                        Điều khoản sử dụng
                    </a>
                </Link>
            </Box>
            <Box
                sx={{
                    width: isSm ? '95%' : '40%',
                    margin: '56px auto 80px auto'
                }}
            >
                <a
                    href='http://m.me/VoizFM'
                    target='_blank'
                    style={{
                        textDecoration: 'none'
                    }}
                >
                    <Button
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            height: '48px',
                            width: '100%',
                            border: `1px solid ${COLORS.blackStroker}`,
                            borderRadius: '8px'
                        }}
                        variant="outlined"
                    >
                        Bạn cần được tư vấn trực tiếp?
                    </Button>
                </a>
            </Box>
            {
                !isSm && (
                    <Divider sx={{ width: '90%', margin: 'auto', borderColor: COLORS.blackStroker }} />
                )
            }
        </Box>
    )
}