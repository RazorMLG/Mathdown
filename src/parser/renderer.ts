import { TokenShapes } from "../types/types";

function renderNode(token: TokenShapes): string {
  switch (token.type) {
    //---------------------
    //Block Cases
    //---------------------

    case "heading": {
      const headLvl = token.level;
      return `<h${headLvl}>${renderChildren(token.children)}</h${headLvl}>`;
    }

    case "paragraph": {
      return `<p>${renderChildren(token.children)}</p>`;
    }

    case "blockquote": {
      return `<blockquote>${renderChildren(token.children)}</blockquote>`;
    }

    case "horizontal_rule": {
      return `<hr />`;
    }

    case "math_block": {
      return `<div class="math-block">${token.rawText}</div>`;
    }

    case "code_block": {
      return `<pre><code class="language-${token.lang}">${token.code}</code></pre>`;
    }

    //---------------------
    // List cases
    //---------------------

    case "unordered_list": {
      return `<ul >${renderChildren(token.children)}</ul>`;
    }

    case "ordered_list": {
      return `<ol type=1>${renderChildren(token.children)}</ol>`;
    }

    case "list_item": {
      return `<li>${renderChildren(token.children)}</li>`;
    }

    //---------------------
    // Inline cases
    //---------------------

    case "text": {
      return token.text;
    }

    case "bold": {
      return `<strong>${renderChildren(token.children)}</strong>`;
    }

    case "italic": {
      return `<em>${renderChildren(token.children)}</em>`;
    }

    case "bold_italic": {
      return `<em><strong>${renderChildren(token.children)}</strong></em>`;
    }

    case "link": {
      return `<a target="_blank" rel="noopener" href="${token.url}">${token.text}</a>`;
    }

    case "image": {
      return `<img src="${token.url}" alt="${token.alt}">`;
    }

    case "math_inline": {
      return `<span class="math-inline">${token.math}</span>`;
    }

    case "code_inline": {
      return `<code>${token.code}</code>`;
    }
  }
}

function renderChildren(tokens: TokenShapes[]): string {
  let renderedText: string = ``;

  for (const token of tokens) {
    renderedText += renderNode(token);
  }

  return renderedText;
}

export function render(tokens: TokenShapes[]): string {
  return renderChildren(tokens);
}
