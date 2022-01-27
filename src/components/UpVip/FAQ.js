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
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
    {
        id: 2,
        question: 'Hội viên VIP có thể nghe được những nội dung nào?',
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
    {
        id: 3,
        question: 'Làm thế nào để có thể thanh toán được gói Hội viên VIP?',
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
    {
        id: 4,
        question: 'Một tài khoản VIP có thể được sử dụng bởi bao nhiêu người?',
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
    {
        id: 5,
        question: 'Chất lượng Sách nói của Voiz như thế nào?',
        answer: 'Hiện nay, Voiz FM nhận thanh toán in-app (tức thanh toán qua kho ứng dụng Apple và Google), đây là kênh thanh toán tiện lợi, có kèm tính năng tự động gia hạn để bảo đảm quá trình trải nghiệm được xuyên suốt. Nếu bạn gặp vấn đề về thanh toán hoặc không thanh toán được in-app, xin liên hệ trực tiếp với Voiz FM để được hướng dẫn thêm.'
    },
]

export default function FAQ() {
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    return (
        <Box>

            <Box
                sx={{
                    bgcolor: COLORS.bg2
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
                    width: '80%',
                    margin: '32px auto 0 auto',
                    ...flexStyle('space-between', 'center')
                }}
            >
                <Link
                    style={{
                        ...(isSm ? TEXT_STYLE.caption10Bold : TEXT_STYLE.content1),
                        color: COLORS.bg4
                    }}
                    href="/"
                >
                    Chính sách bảo mật
                </Link>
                <Link
                    style={{
                        ...(isSm ? TEXT_STYLE.caption10Bold : TEXT_STYLE.content1),
                        color: COLORS.bg4
                    }}
                    href="/"
                >
                    Điều khoản sử dụng
                </Link>
            </Box>
            <Box
                sx={{
                    width: isSm ? '95%' : '40%',
                    margin: '56px auto 80px auto'
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
            </Box>
            <Divider sx={{ width: '90%', margin: 'auto', borderColor: COLORS.blackStroker }} />
        </Box>
    )
}