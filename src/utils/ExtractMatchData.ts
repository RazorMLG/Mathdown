import { TokenShapes } from "../types/types";

export function extractMatchData(match: RegExpMatchArray): TokenShapes {
  const group = Object.keys(match.groups!).find(
    (k) => match.groups![k] !== undefined,
  );
  switch (group) {
    case "code": {
      return {
        type: "code_inline",
        code: match.groups!.codeContent,
      };
    }
    case "math": {
      return {
        type: "math_inline",
        math: match.groups!.mathContent,
      };
    }
    case "image": {
      return {
        type: "image",
        alt: match.groups!.alt,
        url: match.groups!.url,
      };
    }
    case "link": {
      return {
        type: "link",
        text: match.groups!.text,
        url: match.groups!.linkUrl,
      };
    }
    case "bolditalic": {
      return {
        type: "bold_italic",
        rawText: match.groups!.bolditalicText,
        children: [],
      };
    }
    case "bold": {
      return {
        type: "bold",
        rawText: match.groups!.boldText,
        children: [],
      };
    }
    case "italic": {
      return {
        type: "italic",
        rawText: match.groups!.italicText,
        children: [],
      };
    }

    default:
      return {
        type: "text",
        text: "SOMETHING IS WRONG WITH THE MATCHING THIS IS IN EXTRACTMATCHDATA",
      };
  }
}
