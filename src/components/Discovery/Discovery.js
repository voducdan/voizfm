import {
    Box
} from '@mui/material';


// import others components
import DiscoverySlider from './DiscoverySlider';
import DiscoveryContent from './DiscoveryContent';

export default function Discovery() {
    return (
        <Box>
            <DiscoverySlider />
            <DiscoveryContent />
        </Box>
    )
}