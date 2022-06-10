const ISSERVER = typeof window === "undefined";

export const removeAudioListenings = () => {
    if (!ISSERVER) {
        localStorage.removeItem('audioListenings');
    }
}

export const setAudioListenings = (data) => {
    if (!ISSERVER) {
        localStorage.setItem('audioListenings', JSON.stringify(data));
    }
}

export const getAudioListenings = () => {
    if (!ISSERVER) {
        const audioListenings = JSON.parse(localStorage.getItem('audioListenings'));
        return audioListenings ? audioListenings : [];
    }

}