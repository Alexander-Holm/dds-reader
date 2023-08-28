export default function isFlagSet(int: number, flagHex: number){
    // Bitwise AND
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
    return (int & flagHex) == flagHex;
}