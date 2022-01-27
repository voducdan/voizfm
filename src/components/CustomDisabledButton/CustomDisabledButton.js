import { withStyles } from "@material-ui/core/styles";
import { Button } from "@mui/material";

import { COLORS } from '../../utils/constants'

const styles = theme => ({
    button: {
        "&:disabled": {
            backgroundColor: COLORS.bg3,
            color: COLORS.placeHolder,

        },
        backgroundColor: COLORS.main,
        color: COLORS.white
    }
});

function CustomDisabledButton(props) {
    const { classes } = props;
    return (
        <Button sx={{ ...props.style }} disabled={props.disabled} className={classes.button} onClick={props.onClick}>
            {props.content}
        </Button>
    );
}


export default withStyles(styles)(CustomDisabledButton);