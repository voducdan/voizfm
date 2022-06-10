export default function convertSecondsToReadableString(seconds, type = 'long') {
    seconds = seconds || 0;
    seconds = Number(seconds);
    seconds = Math.abs(seconds);

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];

    if (h > 0) {
        parts.push((h + d * 24) + `${type === 'long' ? ' giờ' : 'h'}`);
    }

    if (m > 0) {
        parts.push(m + `${type === 'long' ? ' phút' : "'"}`);
    }

    if (s > 0) {
        parts.push(s + `${type === 'long' ? ' giây' : ''}`);
    }

    return parts.join(`${type === 'long' ? ' ' : ''}`);
}