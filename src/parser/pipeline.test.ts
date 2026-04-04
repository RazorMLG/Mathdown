import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenizer";
import { render } from "./renderer";

function pipeline(markdown: string): string {
  return render(tokenize(markdown));
}

describe("Headings", () => {
  it("renders h1", () => {
    expect(pipeline("# Hello")).toBe("<h1>Hello</h1>");
  });

  it("renders h2", () => {
    expect(pipeline("## Hello")).toBe("<h2>Hello</h2>");
  });

  it("renders h3", () => {
    expect(pipeline("### Hello")).toBe("<h3>Hello</h3>");
  });

  it("renders heading with inline bold", () => {
    expect(pipeline("# Hello **world**")).toBe(
      "<h1>Hello <strong>world</strong></h1>",
    );
  });
});

describe("Paragraph", () => {
  it("renders plain text", () => {
    expect(pipeline("Hello world")).toBe("<p>Hello world\n</p>");
  });

  it("renders bold", () => {
    expect(pipeline("**bold**")).toContain("<strong>bold</strong>");
  });

  it("renders italic", () => {
    expect(pipeline("*italic*")).toContain("<em>italic</em>");
  });

  it("renders bold italic", () => {
    expect(pipeline("***bolditalic***")).toContain(
      "<em><strong>bolditalic</strong></em>",
    );
  });

  it("renders inline code", () => {
    expect(pipeline("`code`")).toContain("<code>code</code>");
  });

  it("renders link", () => {
    expect(pipeline("[text](https://example.com)")).toContain(
      '<a target="_blank" rel="noopener" href="https://example.com">text</a>',
    );
  });

  it("renders image", () => {
    expect(pipeline("![alt](https://example.com/img.png)")).toContain(
      '<img src="https://example.com/img.png" alt="alt">',
    );
  });
});

describe("Unordered list", () => {
  it("renders a single item", () => {
    const html = pipeline("- item one");
    expect(html).toContain("<ul");
    expect(html).toContain("<li>");
    expect(html).toContain("item one");
    expect(html).toContain("</li>");
    expect(html).toContain("</ul>");
  });

  it("renders multiple items", () => {
    const html = pipeline("- first\n- second\n- third");
    expect(html).toContain("first");
    expect(html).toContain("second");
    expect(html).toContain("third");
    expect(html.match(/<li>/g)?.length).toBe(3);
  });

  it("renders item with inline formatting", () => {
    const html = pipeline("- item with **bold**");
    expect(html).toContain("<strong>bold</strong>");
  });

  it("does not freeze on bare dash (regression)", () => {
    // If tokenizer loops forever this test will timeout
    const html = pipeline("-");
    expect(typeof html).toBe("string");
  });
});

describe("Ordered list", () => {
  it("renders a single item", () => {
    const html = pipeline("1. first item");
    expect(html).toContain("<ol");
    expect(html).toContain("<li>");
    expect(html).toContain("first item");
    expect(html).toContain("</li>");
    expect(html).toContain("</ol>");
  });

  it("renders multiple items", () => {
    const html = pipeline("1. one\n2. two\n3. three");
    expect(html).toContain("one");
    expect(html).toContain("two");
    expect(html).toContain("three");
    expect(html.match(/<li>/g)?.length).toBe(3);
  });

  it("does not freeze on bare number-period (regression)", () => {
    const html = pipeline("1.");
    expect(typeof html).toBe("string");
  });
});

describe("Blockquote", () => {
  it("renders a blockquote", () => {
    const html = pipeline("> quoted text");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("quoted text");
    expect(html).toContain("</blockquote>");
  });

  it("renders blockquote with bold inside", () => {
    const html = pipeline("> **bold** inside quote");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<strong>bold</strong>");
  });
});

describe("Code block", () => {
  it("renders fenced code block", () => {
    const html = pipeline("```typescript\nconst x = 1;\n```");
    expect(html).toContain("<pre>");
    expect(html).toContain('<code class="language-typescript">');
    expect(html).toContain("const x = 1;");
  });
});

describe("Math", () => {
  it("renders inline math", () => {
    const html = pipeline("$E = mc^2$");
    expect(html).toContain('<span class="math-inline">E = mc^2</span>');
  });

  it("renders math block", () => {
    const html = pipeline("$$\n\\int_0^\\infty e^{-x} dx\n$$");
    expect(html).toContain('<div class="math-block">');
    expect(html).toContain("\\int_0^\\infty");
  });
});

describe("Horizontal rule", () => {
  it("renders hr", () => {
    expect(pipeline("---")).toContain("<hr");
  });
});

describe("Regression: content after list", () => {
  it("renders paragraph after list with blank line", () => {
    const html = pipeline("- item\n\nSome text after");
    expect(html).toContain("<li>");
    expect(html).toContain("Some text after");
  });
});
