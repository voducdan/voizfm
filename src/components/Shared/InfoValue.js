import {
    Box,
    Typography
} from '@mui/material';

import { COLORS, TEXT_STYLE } from '../../utils/constants';

export default function InfoValue(props) {
    const { value } = props
    return (
        <Box
            sx={{
                bgcolor: COLORS.bg3,
                borderRadius: '20px',
                padding: '4px 16px',
                width: 'fit-content'
            }}
        >
            <Typography
                sx={{
                    ...TEXT_STYLE.content2,
                    color: COLORS.VZ_Text_content
                }}
            >{value}</Typography>
        </Box>
    )
}