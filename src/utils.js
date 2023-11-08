function dateDiff(d1, { seconds, minutes, d2 }) {
    let limit = seconds || minutes * 60;
    if (!d1) return true;
    if (!d2) d2 = new Date();
    const diff = Math.abs(d1 - d2) / 1000;
    return diff >= limit;
}

export {
    dateDiff,
};
