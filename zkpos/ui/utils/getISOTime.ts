const getISOTime = (): string => {
    const UTCDate = new Date();
    const isoString = UTCDate.toISOString();
    const shortIsoString = isoString.substring(0, isoString.length - 8); // "2022-12-04T23:59"
    return shortIsoString;
}

export default getISOTime;