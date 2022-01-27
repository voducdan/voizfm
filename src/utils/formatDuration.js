export default function formatDuration(value) {
    const hour = Math.floor(value / 3600);
    const minute = Math.floor((value - hour * 3600) / 60);
    const secondLeft = value - (minute * 60 + hour * 3600);
    return `${hour > 0 ? `${hour}:` : ''}${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
}