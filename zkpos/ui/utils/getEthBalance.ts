import Web3 from "web3"
// creaet a function that gets Eth balance 
export const getEthBalance = async (address: string) => {
    const ETH_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API?.toString() || ""
    if (ETH_API_KEY) {
        const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETH_API_KEY}`)
        // convert number 
        if (response.ok) {
            const data = await response.json()
            // console.log(`DEBUG: data: ${JSON.stringify(data)}`)
            // convert string to number 
            const balance = Number(data.result) / 1e18
            return balance
        }
    }
}