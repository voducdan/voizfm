export default function OpenBook(props) {
    const { border, fill, bgfill, width, height } = props;
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill={bgfill || 'none'} xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_645_16376)">
                <path d="M18.0689 2.5C16.9393 2.5 16.0234 3.50849 16.0234 4.75242V23.5227C16.0234 22.2787 16.9393 21.2702 18.0689 21.2702H25.9098V2.5H18.0689Z" fill={fill} />
                <path d="M11.9307 2.5H4.08984V21.2702H11.9307C13.0604 21.2702 13.9762 22.2787 13.9762 23.5227V4.75242C13.9762 3.50849 13.0604 2.5 11.9307 2.5Z" fill={fill} />
                <path d="M27.9547 5.23047V23.5259H20.1138C18.9842 23.5259 18.0684 24.4417 18.0684 25.5714H30.0002V5.23047H27.9547Z" fill={border} />
                <path d="M9.88635 23.526H2.04545V5.23047H0V25.5714H11.9318C11.9318 24.4418 11.016 23.526 9.88635 23.526Z" fill={border} />
            </g>
            <defs>
                <clipPath id="clip0_645_16376">
                    <rect width={width} height={height} fill={fill} />
                </clipPath>
            </defs>
        </svg>

    )
}