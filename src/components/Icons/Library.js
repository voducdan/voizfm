import SvgIcon from '@mui/material/SvgIcon';

export default function Library(props) {
    const { stroke } = props
    return (
        <SvgIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.69074" y="2.05988" width="4.14445" height="18.8803" rx="1.15124" stroke={stroke} strokeWidth="1.38148" />
                <path d="M1.92188 5.51367H5.60583" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
                <path d="M1.92188 17.9473H5.60583" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
                <rect x="8.13801" y="2.05988" width="4.14445" height="18.8803" rx="1.15124" stroke={stroke} strokeWidth="1.38148" />
                <path d="M8.36719 5.51367H12.0511" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
                <path d="M8.36719 17.9473H12.0511" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
                <rect x="12.9833" y="2.99703" width="4.14445" height="18.8803" rx="1.15124" transform="rotate(-16 12.9833 2.99703)" stroke={stroke} strokeWidth="1.38148" />
                <path d="M14.1562 6.25391L17.6975 5.23847" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
                <path d="M17.584 18.2051L21.1252 17.1896" stroke={stroke} strokeWidth="1.38148" strokeLinecap="round" />
            </svg>
        </SvgIcon>
    )
}