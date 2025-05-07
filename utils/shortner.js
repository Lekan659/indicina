const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = chars.length;

export function encode(id) {
  
  let short = '';
  while (id > 0) {
    short = chars[id % base] + short;
    id = Math.floor(id / base);
  }
  return short || '0';

}

export function decode(str) {
  return str.split('').reduce((acc, char) => acc * base + chars.indexOf(char), 0);
}
