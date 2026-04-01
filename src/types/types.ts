export type TokenShapes =
  | InlineCodeToken
  | CodeBlockToken
  | HorizontalRuleToken
  | MathInlineToken
  | MathBlockToken
  | BlockquoteToken
  | BoldToken
  | ItalicToken
  | BoldItalicToken
  | LinkToken
  | ImageToken
  | UnorderedListToken
  | OrderedListToken
  | HeadingToken
  | ParagraphToken
  | TextTokenInline
  | ListItemToken;

type InlineCodeToken = {
  type: "code_inline";
  code: string;
};

type CodeBlockToken = {
  type: "code_block";
  code: string;
  lang: string;
};

type HorizontalRuleToken = {
  type: "horizontal_rule";
};

type MathInlineToken = {
  type: "math_inline";
  math: string;
};

type MathBlockToken = {
  type: "math_block";
  rawText: string;
};

type BlockquoteToken = {
  type: "blockquote";
  rawText: string;
  children: TokenShapes[];
};

type BoldToken = {
  type: "bold";
  rawText: string;
  children: TokenShapes[];
};

type ItalicToken = {
  type: "italic";
  rawText: string;
  children: TokenShapes[];
};

type BoldItalicToken = {
  type: "bold_italic";
  rawText: string;
  children: TokenShapes[];
};

type ParagraphToken = {
  type: "paragraph";
  rawText: string;
  children: TokenShapes[];
};

type LinkToken = {
  type: "link";
  text: string;
  url: string;
};

type ImageToken = {
  type: "image";
  alt: string;
  url: string;
};

type UnorderedListToken = {
  type: "unordered_list";
  children: ListItemToken[];
};

type OrderedListToken = {
  type: "ordered_list";
  children: ListItemToken[];
};

export type ListItemToken = {
  type: "list_item";
  rawText: string;
  prefix: string;
  children: TokenShapes[];
};

type HeadingToken = {
  type: "heading";
  rawText: string;
  level: number;
  children: TokenShapes[];
};

type TextTokenInline = {
  type: "text";
  text: string;
};
