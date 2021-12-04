export default function Clock(props) {
    const { bgfill, fill } = props
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill={bgfill} xmlns="http://www.w3.org/2000/svg">
            <path d="M8 16C3.58839 16 0 12.4116 0 8C0 3.58839 3.58839 0 8 0C12.4116 0 16 3.58839 16 8C16 12.4116 12.4116 16 8 16ZM8 0.607995C3.924 0.607995 0.607995 3.924 0.607995 8C0.607995 12.076 3.924 15.392 8 15.392C12.076 15.392 15.392 12.076 15.392 8C15.392 3.924 12.076 0.607995 8 0.607995Z" fill={fill} />
            <path d="M11.5403 12.306C11.4564 12.306 11.3725 12.2707 11.3129 12.2039L7.69531 8.11571V3.69072C7.69531 3.52291 7.8315 3.38672 7.99931 3.38672C8.16712 3.38672 8.30331 3.52291 8.30331 3.69072V7.88588L11.7677 11.8014C11.8783 11.9266 11.8674 12.1187 11.7409 12.2306C11.6838 12.2817 11.6108 12.306 11.5403 12.306Z" fill={fill} />
        </svg>

    )
}