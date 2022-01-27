// import react
import { useState, useEffect } from 'react';

// import others component
import TabPanel from '../../../components/TabPanel/TabPanel';

// import mui components
import {
    Box,
    Typography
} from '@mui/material'

// import utils
import { flexStyle } from '../../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../../utils/constants';

// import services
import API from '../../../services/api'

const PanelContent = (props) => {
    const { transactions, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('center', 'flex-start'),
                flexDirection: 'column',
                backgroundColor: COLORS.bg2,
                rowGap: isSm ? '24px' : '32px',
                padding: isSm ? '16px' : '32px'
            }}>
            <Typography sx={{ ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2), color: COLORS.white }}>Lịch sử giao dịch</Typography>
            <Box
                sx={{
                    ...flexStyle('center', 'center'),
                    flexDirection: 'column',
                    rowGap: '16px',
                    width: '100%'
                }}
            >
                {
                    transactions.map((item, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                backgroundColor: COLORS.bg3,
                                boxSizing: 'border-box',
                                padding: '24px',
                                borderRadius: '10px',
                                width: '100%',
                                ...flexStyle('flex-start', 'flex-start'),
                                rowGap: '10px',
                                flexDirection: 'column'
                            }}
                        >
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1), color: COLORS.VZ_Text_content }} >
                                    Tên:
                                </Typography>
                                <Typography sx={{ ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1), color: COLORS.white, marginLeft: '7px' }}>
                                    {item?.name}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ display: 'flex', ...TEXT_STYLE.content1, color: COLORS.VZ_Text_content }} >
                                    Đơn giá:
                                </Typography>
                                <Typography sx={{ ...TEXT_STYLE.title1, color: COLORS.white, marginLeft: '7px' }}>
                                    {item?.amount ? item.amount : item?.coin}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ display: 'flex', ...TEXT_STYLE.content1, color: COLORS.VZ_Text_content }} >
                                    Mã giao dịch:
                                </Typography>
                                <Typography sx={{ ...TEXT_STYLE.title1, color: COLORS.white, marginLeft: '7px' }}>
                                    {item?.reference_number}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ display: 'flex', ...TEXT_STYLE.content1, color: COLORS.VZ_Text_content }} >
                                    Thời gian:
                                </Typography>
                                <Typography sx={{ ...TEXT_STYLE.title1, color: COLORS.white, marginLeft: '7px' }}>
                                    {`${item?.paid_at}`}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default function HistoryTransaction(props) {
    const api = new API();
    const { isSm, value } = props
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchTransactionHistory() {
            const res = await api.getUserTransactionHistory();
            const data = await res.data.data;
            setTransactions(data);
        }

        fetchTransactionHistory();
    }, [])

    return (
        <TabPanel isSm={isSm} value={value} index={0} children={<PanelContent isSm={isSm} transactions={transactions} />} ></TabPanel>
    )
}