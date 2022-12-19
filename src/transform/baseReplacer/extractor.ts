type Quote = '"' | "'" | '`';

export function extractArgumentsIndex(
  matchIndex: number,
  matchLen: number,
  wholeText: string,
) {
  const initialIndex = matchIndex + matchLen - 1;
  const getQuote = (index): Quote | false =>
    ['"', "'", '`'].includes(wholeText[index])
      ? (wholeText[index] as Quote)
      : false;

  // check if inside a string
  let isInString: Quote | false = false;

  // balance round brackets to know when to stop consuming
  // 1 => initial bracket
  let balanceBracketCheck = 1;

  // check for escapes
  const lastChar: string = null;

  // to be found
  let finalIndex: number = null;

  for (let i = initialIndex; i < wholeText.length; i++) {
    const isQuote = getQuote(i);
    if (isQuote) {
      if (isInString === isQuote && lastChar !== '\\') {
        isInString = false;
      } else {
        isInString = isQuote;
      }
      continue;
    }

    if (wholeText[i] === '(') {
      balanceBracketCheck++;
      continue;
    }

    if (wholeText[i] === ')') {
      if (--balanceBracketCheck === 0) {
        finalIndex = i;
        break;
      }
    }
  }

  return wholeText.slice(initialIndex, finalIndex);
}
