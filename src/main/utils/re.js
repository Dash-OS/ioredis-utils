/* @flow */

const TRAILING_COMMENTS = /\s+#.*$/gm;
const SURROUNDING_WHITESPACE = /^\s+|\s+$/gm;
const LITERAL_NEW_LINES = /[\r\n]/g;

export default function re(flags: string) {
  return (
    strings: Array<string> | { +raw: Array<string>, [key: string]: * },
    ...values: Array<?RegExp>
  ) => {
    function toPattern(pattern: string, rawString: string, i: number) {
      let value = values[i];

      if (value == null) {
        return pattern + rawString;
      }

      if (value instanceof RegExp) {
        value = value.source;
      }

      return pattern + rawString + value;
    }

    // $FlowIgnore
    const compiledPattern = strings.raw
      .reduce(toPattern, '')
      .replace(TRAILING_COMMENTS, '')
      .replace(SURROUNDING_WHITESPACE, '')
      .replace(LITERAL_NEW_LINES, '');

    return new RegExp(compiledPattern, flags);
  };
}
