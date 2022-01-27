// import MUI components
import {
    Box
} from '@mui/material';

// import others components
import VipPackage from "./VipPackage";
import VipBenefit from "./VipBenefit";
import VipCombo from "./VipCombo";
import FAQ from "./FAQ";

export default function UpVip() {
    return (
        <Box>
            <VipPackage />
            <VipBenefit />
            <VipCombo />
            <FAQ />
        </Box>
    )
}