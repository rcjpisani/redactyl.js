// Type definitions for redactyl.js 1.2
// Project: https://github.com/rcjpisani/redactyl.js

declare namespace Redactyl {
  interface Options {
    /**
     * An array of property names that should be redacted.
     */
    properties: string[];

    /**
     * Custom text to replace the redacted properties with. Default: [REDACTED]
     */
    text?: string;
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
  redact<T extends object[]|object = any>(input: T): T;

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
}

export = Redactyl;
