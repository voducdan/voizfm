
import { HEADER_HEIGHT, SCREEN_BREAKPOINTS } from "../../utils/constants"

export default function Logo(props) {
    return (
        <div style={{
            height: HEADER_HEIGHT,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...(props.windowWidth <= SCREEN_BREAKPOINTS.sm && { justifyContent: 'flex-start', marginLeft: '49px' }),
        }}>
            <img
                src="/images/logo.png"
                alt="voizfm logo"
                loading="lazy"
            />
        </div>
    )
}
