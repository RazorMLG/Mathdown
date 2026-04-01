import { ListItemToken, TokenShapes } from "../types/types";
import { extractMatchData } from "../utils/ExtractMatchData";

function parseBlocks(markdown: string): TokenShapes[] {
  let blocks: TokenShapes[] = [];
  let line = 0;
  let contentArr = markdown.split("\n");
  const textLength = contentArr.length;
  let currentLine = contentArr[line];

  while (line < textLength) {
    currentLine = contentArr[line];

    switch (true) {
      case /^#{1,3}/.test(currentLine): {
        const match = currentLine.match(/^#{1,3}/)!;
        let headingLevel = match[0].length;

        blocks.push({
          type: "heading",
          rawText: currentLine.slice(headingLevel + 1),
          level: headingLevel,
          children: [],
        });

        line++;
        break;
      } // Heading

      case /^```/.test(currentLine): {
        const lang = currentLine.slice(3);
        line++;
        currentLine = contentArr[line];
        let textInCodeBlock = ``;
        while (line < textLength && !/^```\s*$/.test(currentLine)) {
          textInCodeBlock += currentLine + "\n";
          line++;
          currentLine = contentArr[line];
        }
        line++;
        blocks.push({
          type: "code_block",
          code: textInCodeBlock,
          lang: lang,
        });
        break;
      } //Code Block

      case /^\$\$\s*$/.test(currentLine): {
        line++;
        currentLine = contentArr[line];
        let textInMathBlock = ``;
        while (line < textLength && !/^\$\$\s*$/.test(currentLine)) {
          textInMathBlock += currentLine.trim() + "\n";
          line++;
          currentLine = contentArr[line];
        }
        line++;
        blocks.push({
          type: "math_block",
          rawText: textInMathBlock,
        });
        break;
      } //math block

      case /^---$|^\*\*\*$/.test(currentLine): {
        blocks.push({ type: "horizontal_rule" });
        line++;
        break;
      } //horizontal rule

      case /^>/.test(currentLine): {
        let textInBlockquote = ``;
        while (line < textLength && /^>/.test(currentLine)) {
          textInBlockquote += currentLine.slice(1).trim() + `\n\n`;
          line++;
          currentLine = contentArr[line];
        }

        blocks.push({
          type: "blockquote",
          rawText: textInBlockquote,
          children: [],
        });
        break;
      } //blockquote

      case /^(-|^\*)\s+/.test(currentLine): {
        let textInUOList = ``;
        let listPrefix = currentLine[0];
        let UnorderedListToken: TokenShapes = {
          type: "unordered_list",
          children: [],
        };

        while (line < textLength && /^(-|^\*)\s+/.test(currentLine)) {
          textInUOList += currentLine.slice(1).trim();

          UnorderedListToken.children.push({
            type: "list_item",
            rawText: textInUOList,
            prefix: listPrefix,
            children: [],
          });

          line++;
          currentLine = contentArr[line];
          textInUOList = ``;
        }

        blocks.push(UnorderedListToken);
        // line++;
        break;
      } // unordered list

      case /^(\d+\.)\s+/.test(currentLine): {
        let textInOList = ``;
        let OrderedListToken: TokenShapes = {
          type: "ordered_list",
          children: [],
        };
        while (line < textLength && /^(\d+\.)\s+/.test(currentLine)) {
          let match = currentLine.match(/^\d+\./)!;
          textInOList = currentLine.slice(match[0].length + 1).trim();

          OrderedListToken.children.push({
            type: "list_item",
            rawText: textInOList,
            prefix: match[0],
            children: [],
          });

          line++;
          currentLine = contentArr[line];
          textInOList = ``;
        }

        blocks.push(OrderedListToken);

        break;
      } // ordered list

      case /^$|^\s*$/.test(currentLine): {
        line++;
        break;
      } // TODO: FIX THIS IN THE FUTURE IF EMPTY LINES GET FORGOTTEN

      default: {
        let textInParagraph = ``;
        while (
          line < textLength &&
          !/^$|^\s*$|^#{1,3}|^```|^\$\$\s*$|^---\s*$|^\*{3}\s*$|^>|^-\s+|^\*\s+|^\d+\./.test(
            currentLine,
          )
        ) {
          textInParagraph += currentLine.trim() + "\n";
          line++;
          currentLine = contentArr[line];
        }

        blocks.push({
          type: "paragraph",
          rawText: textInParagraph,
          children: [],
        });
        textInParagraph ? `` : line++;

        break;
      } //paragraph
    }
  }

  return blocks;
}

export function parseInlines(rawText: string): TokenShapes[] {
  let parsedText: TokenShapes[] = [];
  let cursor = 0;

  const Regex =
    /(?<code>`(?<codeContent>[^`]+)`)|(?<math>\$(?<mathContent>\S[^$\n]*\S|\S)\$)|(?<image>!\[(?<alt>[^\]]*)\]\((?<url>[^)]*)\))|(?<link>\[(?<text>[^\]]*)\]\((?<linkUrl>[^)]*)\))|(?<bolditalic>\*\*\*(?<bolditalicText>\S[^*]*\S|\S)\*\*\*)|(?<bold>\*\*(?<boldText>(?:\*[^*]+\*|[^*])+)\*\*)|(?<italic>\*(?<italicText>(?:\*\*[^*]+\*\*|[^*])+)\*)/g;

  for (const match of rawText.matchAll(Regex)) {
    if (cursor < match.index) {
      parsedText.push({
        type: "text",
        text: rawText.substring(cursor, match.index),
      });
    }
    const token = extractMatchData(match);
    if (
      token.type === "bold" ||
      token.type === "italic" ||
      token.type === "bold_italic"
    ) {
      parsedText.push({ ...token, children: parseInlines(token.rawText) });
    } else {
      parsedText.push(token);
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < rawText.length) {
    parsedText.push({
      type: "text",
      text: rawText.substring(cursor),
    });
  }

  return parsedText;
}

export function tokenize(markdown: string): TokenShapes[] {
  let markdownStructure: TokenShapes[] = [];
  let blocks: TokenShapes[] = parseBlocks(markdown);

  for (const block of blocks) {
    if (
      block.type === "code_block" ||
      block.type === "math_block" ||
      block.type === "horizontal_rule"
    ) {
      markdownStructure.push(block);
    } else if (block.type === "blockquote") {
      markdownStructure.push({ ...block, children: tokenize(block.rawText) });
    } else if (block.type === "heading" || block.type === "paragraph") {
      markdownStructure.push({
        ...block,
        children: parseInlines(block.rawText),
      }); // Parses blocks for bold's link's etc...
    } else if (
      block.type === "unordered_list" ||
      block.type === "ordered_list"
    ) {
      let listItems: ListItemToken[] = [];
      for (const listItem of block.children) {
        listItems.push({
          ...listItem,
          children: parseInlines(listItem.rawText),
        });
      }
      markdownStructure.push({ ...block, children: listItems });
    }
  }

  return markdownStructure;
}
