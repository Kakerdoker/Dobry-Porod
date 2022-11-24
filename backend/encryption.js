import { Buffer } from 'buffer';
const crypto = require('crypto-js');

function MurmurHash3(string) {
    let i = 0;
    let hash = 1779033703;
    
    for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
        let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
        hash = Math.imul(bitwise_xor_from_character, 3432918353);
        hash = hash << 13 | hash >>> 19;
    } return () => {
        hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
        hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
        return (hash ^= hash >>> 16) >>> 0;
    }
}

function Mulberry32(string) {
    return () => {
        let for_bit32_mul = string += 0x6D2B79F5;
        let cast32_one = for_bit32_mul ^ for_bit32_mul >>> 15;
        let cast32_two = for_bit32_mul | 1;
        for_bit32_mul = Math.imul(cast32_one, cast32_two);
        for_bit32_mul ^= for_bit32_mul + Math.imul(for_bit32_mul ^ for_bit32_mul >>> 7, for_bit32_mul | 61);
        return ((for_bit32_mul ^ for_bit32_mul >>> 14) >>> 0) % 65535;
    }
}

function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
  
    return new Date(
      date.toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

function generateKey(login){
    let date_ob = changeTimeZone(new Date(), 'America/Los_Angeles');
    let date = date_ob.getFullYear() + "" + date_ob.getMonth() + "" + date_ob.getDate();
    let seed = login;
    
    let generate_seed = MurmurHash3(seed);
    let random_number = Mulberry32(generate_seed());

    const arr = new Uint16Array(8);
    for (let i = 0; i < 9; i++) {
        arr[i] = random_number();
    }
    return Buffer.from(arr.buffer).toString('hex');
}

function encryptData(data) {
  const key = generateKey("hg73qnc06j-2k6zf36k841lg86ng65m3l8");
  const encryptedData = crypto.AES.encrypt(JSON.stringify(data), key).toString();
  return encryptedData;
}

module.exports = { encryptData };