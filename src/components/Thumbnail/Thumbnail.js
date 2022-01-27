import {
    Box
} from '@mui/material';

export default function Thumbnail(props) {
    const { style, avtSrc, alt, promotion } = props;
    return (
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                '&::before': {
                    content: `'${promotion ? promotion.toUpperCase() : ''}'`,
                    background: promotion === 'vip' ? '#F68C2D' : 'white',
                    fontFamily: "'fs-ui-display-medium', 'sans-serif'",
                    fontWeight: 'bold',
                    color: promotion === 'vip' ? '#ffffff' : '#343BBE',
                    fontStyle: 'italic',
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    zIndex: 8,
                    fontSize: '10px',
                    borderTopLeftRadius: '20px',
                    borderBottomRightRadius: '9px',
                    padding: ' 2px 0',
                    border: '1px solid #FDB561',
                    width: '42px',
                    textAlign: 'center',
                }
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