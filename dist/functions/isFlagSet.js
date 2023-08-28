export default function isFlagSet(int, flagHex) {
    // Bitwise AND
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND
    return (int & flagHex) == flagHex;
}
