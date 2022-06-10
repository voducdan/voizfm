// import reducer, actions
import { setOpenLogin } from '../../redux/openLogin';
import { setFooter } from '../../redux/footer';

import fetchAudioUrl from './fetchAudioUrl';

// import service
import API from '../../services/api';

const handlePlayAudio = async (
    dispatch,
    user,
    audioId,
    playlistId,
    promotion,
    setErrorMessage,
    setOpenUpdateRequiredModal,
    setOpenUnauthorizedModal,
    setOpenDonwloadAppModal,
    setOpenSnackbar
) => {
    const api = new API();
    try {
        if (!user && promotion !== 'free') {
            dispatch(setOpenLogin(true));
            return;
        }
        if (user) {
            await api.addListeningPlaylists(audioId, 0, playlistId);
        }
        dispatch(setFooter(false));
        fetchAudioUrl(
            dispatch,
            audioId,
            setErrorMessage,
            setOpenUpdateRequiredModal,
            setOpenUnauthorizedModal,
            setOpenDonwloadAppModal,
            setOpenSnackbar
        );
    }
    catch (err) {
        console.log(err)
        const errList = err?.response?.data?.error;
        if (errList instanceof Object) {
            let errMessage = '';
            for (let e in errList) {
                const key = Object.keys(errList[e])[0];
                const value = errList[e][key]
                errMessage += `${key} ${value} \n`
            }
            setErrorMessage(errMessage)
            setOpenSnackbar(true);
            return;
        }
        setErrorMessage(errList)
        setOpenSnackbar(true);
    }
};

export default handlePlayAudio;