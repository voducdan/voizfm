import SvgIcon from '@mui/material/SvgIcon';

export default function CasourelPrev() {
    return (
        <SvgIcon style={{ overflow: 'visible' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_459_886)">
                    <circle r="12" transform="matrix(-1 0 0 1 16 12)" fill="#754ADA" />
                    <path d="M12.8729 11.5717L18.2693 6.17714C18.5061 5.94095 18.8897 5.94095 19.1271 6.17714C19.3639 6.41333 19.3639 6.79697 19.1271 7.03316L14.1588 11.9997L19.1265 16.9662C19.3633 17.2024 19.3633 17.586 19.1265 17.8228C18.8897 18.059 18.5055 18.059 18.2687 17.8228L12.8723 12.4283C12.6391 12.1945 12.6391 11.8048 12.8729 11.5717Z" fill="white" />
                </g>
                <defs>
                    <filter id="filter0_d_459_886" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_459_886" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_459_886" result="shape" />
                    </filter>
                </defs>
            </svg>
        </SvgIcon>
    )
}