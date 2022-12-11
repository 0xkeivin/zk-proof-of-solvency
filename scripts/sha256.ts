import { ethers, utils } from "ethers";


const a = utils.sha256("0x")
const b = utils.hexValue(a)
console.log(a)
console.log(typeof a)
console.log(b)
console.log(typeof b)



const emptyBuffer = Buffer.alloc(32)
console.log(emptyBuffer)
console.log(typeof emptyBuffer)