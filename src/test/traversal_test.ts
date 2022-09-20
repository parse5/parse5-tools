import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {html} from 'parse5';
import type {
  Document,
  Element,
  TextNode,
  DocumentFragment
} from 'parse5/dist/tree-adapters/default.js';

test('query', async (t) => {
  await t.test('retrieves first matching child', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    const result = main.query(node, (n) => n.nodeName === '#text');

    assert.strictEqual(result, child1);
  });

  await t.test('does not return root if it matches', () => {
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };
    const result = main.query(node, () => true);

    assert.strictEqual(result, null);
  });

  await t.test('null when no match', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    const result = main.query(node, () => false);

    assert.strictEqual(result, null);
  });

  await t.test('retrieves deep matches', () => {
    const subChild: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subChild]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child]
    };
    const result = main.query(node, (n) => n === subChild);

    assert.strictEqual(result, subChild);
  });

  await t.test('returns null if root is not parent node', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };
    const result = main.query(node, () => true);

    assert.strictEqual(result, null);
  });
});

test('queryAll', async (t) => {
  await t.test('retrieves matching nodes', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    const result = [...main.queryAll(node, (n) => n.nodeName === '#text')];

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child1);
  });

  await t.test('retrieves deep matches', () => {
    const subChild0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const subChild1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'another text node'
    };
    const child: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subChild0, subChild1]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child]
    };
    const result = [...main.queryAll(node, (n) => n.nodeName === '#text')];

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], subChild0);
    assert.strictEqual(result[1], subChild1);
  });

  await t.test('does not match root', () => {
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };

    const result = [...main.queryAll(node, () => true)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('returns empty if root isnt parent-like', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };

    const result = [...main.queryAll(node, () => true)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('returns all nodes if no condition', () => {
    const subChild0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const subChild1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'another text node'
    };
    const child: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subChild0, subChild1]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child]
    };
    const result = [...main.queryAll(node)];

    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0], child);
    assert.strictEqual(result[1], subChild0);
    assert.strictEqual(result[2], subChild1);
  });
});

test('walkChildren', async (t) => {
  await t.test('yields nothing when no children', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const result = [...main.walkChildren(node)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('yields direct children', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'another text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0, child1]
    };
    const result = [...main.walkChildren(node)];

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], child0);
    assert.strictEqual(result[1], child1);
  });

  await t.test('yields deep children', () => {
    const subChild0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const subChild1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'another text node'
    };
    const child: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subChild0, subChild1]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child]
    };
    const result = [...main.walkChildren(node)];

    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0], child);
    assert.strictEqual(result[1], subChild0);
    assert.strictEqual(result[2], subChild1);
  });
});

test('ancestors', async (t) => {
  await t.test('yields root and ancestors', () => {
    const subSubChild: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const subChild: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subSubChild]
    };
    const child: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [subChild]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child]
    };

    child.parentNode = node;
    subChild.parentNode = child;
    subSubChild.parentNode = subChild;

    const result = [...main.ancestors(subSubChild)];

    assert.strictEqual(result.length, 4);
    assert.strictEqual(result[0], subSubChild);
    assert.strictEqual(result[1], subChild);
    assert.strictEqual(result[2], child);
    assert.strictEqual(result[3], node);
  });

  await t.test('handles missing parentId', () => {
    const child: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };

    const result = [...main.ancestors(child)];

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child);
  });
});

test('previousSiblings', async (t) => {
  await t.test('empty set for non-child-like nodes', () => {
    const node: Document = {
      nodeName: '#document',
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };

    const result = [...main.previousSiblings(node)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('empty set for node with missing parent', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };

    const result = [...main.previousSiblings(node)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('retrieves previous siblings', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0, child1, child2]
    };

    child0.parentNode = node;
    child1.parentNode = node;
    child2.parentNode = node;

    const result = [...main.previousSiblings(child1)];

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child0);
  });
});

test('nextSiblings', async (t) => {
  await t.test('empty set for non-child-like nodes', () => {
    const node: Document = {
      nodeName: '#document',
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: []
    };

    const result = [...main.nextSiblings(node)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('empty set for node with missing parent', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };

    const result = [...main.nextSiblings(node)];

    assert.strictEqual(result.length, 0);
  });

  await t.test('retrieves next siblings', () => {
    const child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child0, child1, child2]
    };

    child0.parentNode = node;
    child1.parentNode = node;
    child2.parentNode = node;

    const result = [...main.nextSiblings(child1)];

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });
});
