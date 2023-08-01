import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {defaultTreeAdapter, html} from 'parse5';
import type {
  Document,
  CommentNode,
  Element,
  TextNode,
  Template,
  DocumentType,
  DocumentFragment
} from '../nodeTypes.js';

test('isElementNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isElementNode, defaultTreeAdapter.isElementNode);
  });
});

test('isCommentNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isCommentNode, defaultTreeAdapter.isCommentNode);
  });
});

test('isDocumentTypeNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(
      main.isDocumentTypeNode,
      defaultTreeAdapter.isDocumentTypeNode
    );
  });
});

test('isTextNode', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.isTextNode, defaultTreeAdapter.isTextNode);
  });
});

test('isDocument', async (t) => {
  await t.test('true for document nodes', () => {
    const result = main.isDocument({
      nodeName: '#document',
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document nodes', () => {
    const result = main.isDocument({
      nodeName: '#text',
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isDocumentFragment', async (t) => {
  await t.test('true for document fragment nodes', () => {
    const result = main.isDocumentFragment({
      nodeName: '#document-fragment',
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isDocument({
      nodeName: '#text',
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isTemplateNode', async (t) => {
  await t.test('true for template nodes', () => {
    const result = main.isTemplateNode({
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: '#document-fragment',
        childNodes: []
      },
      attrs: [],
      namespaceURI: html.NS.HTML,
      parentNode: null,
      childNodes: []
    });

    assert.ok(result);
  });

  await t.test('false for non-document-fragment nodes', () => {
    const result = main.isTemplateNode({
      nodeName: '#text',
      value: 'pewpew',
      parentNode: null
    });

    assert.strictEqual(result, false);
  });
});

test('isParentNode', async (t) => {
  await t.test('true for document nodes', () => {
    const node: Document = {
      nodeName: '#document',
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for document fragment nodes', () => {
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      tagName: 'DIV',
      attrs: [],
      namespaceURI: html.NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: '#document-fragment',
        childNodes: []
      },
      attrs: [],
      namespaceURI: html.NS.HTML,
      parentNode: null,
      childNodes: []
    };
    assert.strictEqual(main.isParentNode(node), true);
  });

  await t.test('false for text nodes', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isParentNode(node), false);
  });
});

test('isChildNode', async (t) => {
  await t.test('true for element nodes', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for template nodes', () => {
    const node: Template = {
      nodeName: 'template',
      parentNode: null,
      tagName: 'template',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [],
      content: {
        nodeName: '#document-fragment',
        childNodes: []
      }
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for comment nodes', () => {
    const node: CommentNode = {
      nodeName: '#comment',
      parentNode: null,
      data: 'oogaboogah'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for text nodes', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'well hello there'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('true for document type nodes', () => {
    const node: DocumentType = {
      nodeName: '#documentType',
      parentNode: null,
      name: 'cats',
      publicId: 'c-a-t-s',
      systemId: 'm-e-o-w'
    };
    assert.strictEqual(main.isChildNode(node), true);
  });

  await t.test('false for document nodes', () => {
    const node: Document = {
      nodeName: '#document',
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };
    assert.strictEqual(main.isChildNode(node), false);
  });
});
