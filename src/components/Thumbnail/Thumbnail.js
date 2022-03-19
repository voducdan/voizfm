import {
    Box
} from '@mui/material';

import useWindowSize from '../../utils/useWindowSize';
import { SCREEN_BREAKPOINTS } from '../../utils/constants';

export default function Thumbnail(props) {
    const { style, avtSrc, alt, promotion } = props;
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    return (
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                ...(promotion && {
                    '&::before': {
                        content: promotion === 'vip' ? "url('/images/dvip.png')" : "url('/images/dfree.png')",
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 8
                    }
                })
            }}
        >
            <img
                style={{
                    ...style
                }}
                src={avtSrc}
                alt={alt}
                loading="lazy"
            />
        </Box>
    )
}