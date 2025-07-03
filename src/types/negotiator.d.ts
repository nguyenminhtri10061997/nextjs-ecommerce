declare module 'negotiator' {
  class Negotiator {
    constructor(options: { headers: Record<string, string> });

    languages(supported?: string[]): string[];
    mediaTypes(supported?: string[]): string[];
    charsets(supported?: string[]): string[];
    encodings(supported?: string[]): string[];
  }

  export = Negotiator;
}