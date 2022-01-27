import SvgIcon from '@mui/material/SvgIcon';

export default function CarouselNext() {
    return (
        <SvgIcon style={{ overflow: 'visible' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_459_887)">
                    <circle cx="16" cy="12" r="12" fill="#754ADA" />
                    <path d="M19.1271 11.5717L13.7307 6.17714C13.4939 5.94095 13.1103 5.94095 12.8729 6.17714C12.6361 6.41333 12.6361 6.79697 12.8729 7.03316L17.8412 11.9997L12.8735 16.9662C12.6367 17.2024 12.6367 17.586 12.8735 17.8228C13.1103 18.059 13.4945 18.059 13.7313 17.8228L19.1277 12.4283C19.3609 12.1945 19.3609 11.8048 19.1271 11.5717Z" fill="white" />
                </g>
                <defs>
                    <filter id="filter0_d_459_887" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_459_887" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_459_887" result="shape" />
                    </filter>
                </defs>
            </svg>

        </SvgIcon>
    )
}