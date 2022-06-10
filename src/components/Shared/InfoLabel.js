import {
    Typography
} from '@mui/material';

import { COLORS, TEXT_STYLE } from '../../utils/constants';


export default function InfoLabel(props) {
    const { title } = props;
    return (
        <Typography
            sx={{
                ...TEXT_STYLE.title2,
                color: COLORS.white
            }}
        >
            {title}
        </Typography>
    )
}