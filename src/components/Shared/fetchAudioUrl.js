// import reducer, actions
import { setAudioHls } from '../../redux/playAudio';
import { setAudioData } from '../../redux/audio';

// import service
import API from '../../services/api';

const fetchAudioUrl = async (
    dispatch,
    id,
    setErrorMessage,
    setOpenUpdateRequiredModal,
    setOpenUnauthorizedModal,
    setOpenDonwloadAppModal,
    setOpenSnackbar
) => {
    const api = new API();
    try {
        const resAudioFile = await api.getAudioFile(id);
        const data = await resAudioFile.data.data;
        const resAudio = await api.getAudio(id);
        const audioDataFromApi = await resAudio.data.data;
        dispatch(setAudioHls(data.url));
        dispatch(setAudioData(audioDataFromApi));
    }
    catch (err) {
        console.log(err)
        const status = err?.response?.status;
        if (status === 400) {
            const errMsg = err?.response?.data?.error;
            if (errMsg && errMsg === 'Nghe tiếp sách này tại ứng dụng Voiz FM') {
                setOpenDonwloadAppModal(true);
                return;
            }
            setErrorMessage('Quý khách chưa đăng ký dịch vụ thành công. Vui lòng kiểm tra lại')
            setOpenUpdateRequiredModal(true);
            return;
        }
        if (status === 401) {
            setErrorMessage('Bạn chưa có quyền truy cập audio này.')
            setOpenUnauthorizedModal(true);
            return;
        }
        setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại sau!')
        setOpenSnackbar(true);
    }
}

export default fetchAudioUrl;