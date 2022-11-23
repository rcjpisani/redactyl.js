// Type definitions for redactyl.js 1.2
// Project: https://github.com/rcjpisani/redactyl.js

declare namespace Redactyl {
  interface RedactData<Type extends object[] | object = any> {
    <Type>(arg: Type): Type;
  }

  interface Options {
    /**
     * An array of property names that should be redacted.
     */
    properties: string[];

    /**
     * Custom text to replace the redacted properties with. Default: [REDACTED]
     */
    text?: string;

    /**
     * Custom replacer function
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter|MDN}
     */
    replacer?: (key: string, value: RedactData) => RedactData;
  }
}

declare class Redactyl {
  constructor(opts: Redactyl.Options);

  /**
   * Traverse through the specified JSON and replace all properties that match
   * the property names set through the constructor options object, or the
   * setText function
   * .
   * @param input
   */
  redact<T extends Redactyl.RedactData>(input: T): T;

  /**
   * Set the text to replace the redacted properties with. Default: [REDACTED]
   *
   * @param text Text to replace the redacted properties with.
   */
  setText(text: string): Redactyl;

  /**
   * Add the names of properties that should be redacted.
   *
   * @param properties Additional names of properties
   */
  addProperties(properties: string[]): Redactyl;

  /**
   * Set a custom replacer function for the stringification process
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#the_replacer_parameter|MDN}
   */
  setReplacer(fn: Redactyl.Options['replacer']): Redactyl;
}

export = Redactyl;
