export const shortenAddress = (address: any) => {
    if (address === undefined) {
        return "undefined";
    }
    return address.slice(0, 8) + "..." + address.slice(-5);
};