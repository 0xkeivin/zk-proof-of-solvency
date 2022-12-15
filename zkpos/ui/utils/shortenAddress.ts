export const shortenAddress = (address: any) => {
    return address.slice(0, 8) + "..." + address.slice(-5);
};