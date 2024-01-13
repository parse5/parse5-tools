import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {html} from 'parse5';
import type {
  CommentNode,
  Element,
  TextNode,
  DocumentType,
  DocumentFragment
} from '../nodeTypes.js';

test('getTextContent', async (t) => {
  await t.test('returns data of comment', () => {
    const node: CommentNode = {
      nodeName: '#comment',
      parentNode: null,
      data: 'some text'
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'some text');
  });

  await t.test('returns value of text node', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'some text');
  });

  await t.test('concats all text-like children', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child2: CommentNode = {
      nodeName: '#comment',
      parentNode: null,
      data: 'comment node'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'text nodecomment node');
  });

  await t.test('ignores non-text children', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'text node'
    };
    const child2: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'text node');
  });

  await t.test('concats deep text-like children', () => {
    const level0Child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'level 0'
    };
    const level1Child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'level 1'
    };
    const level2Child0: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'level 2'
    };
    const level1Child1: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [level2Child0]
    };
    const level0Child1: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: [level1Child0, level1Child1]
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [level0Child0, level0Child1]
    };

    const result = main.getTextContent(node);

    assert.strictEqual(result, 'level 0level 1level 2');
  });
});

test('setTextContent', async (t) => {
  await t.test('sets data of comment nodes', () => {
    const node: CommentNode = {
      nodeName: '#comment',
      parentNode: null,
      data: 'some text'
    };

    main.setTextContent(node, 'some other text');

    assert.strictEqual(node.data, 'some other text');
  });

  await t.test('sets value of text nodes', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };

    main.setTextContent(node, 'some other text');

    assert.strictEqual(node.value, 'some other text');
  });

  await t.test('appends text node for parent nodes', () => {
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };

    main.setTextContent(node, 'some text');

    assert.strictEqual(node.childNodes.length, 1);
    assert.deepStrictEqual(node.childNodes[0], {
      nodeName: '#text',
      value: 'some text',
      parentNode: node
    });
  });

  await t.test('sets text node for parent nodes', () => {
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };

    node.childNodes.push({
      nodeName: '#text',
      value: 'old text',
      parentNode: node
    });

    main.setTextContent(node, 'new text');

    assert.strictEqual(node.childNodes.length, 1);
    assert.deepStrictEqual(node.childNodes[0], {
      nodeName: '#text',
      value: 'new text',
      parentNode: node
    });
  });

  await t.test('ignores document type nodes', () => {
    const node: DocumentType = {
      nodeName: '#documentType',
      parentNode: null,
      name: 'some-name',
      publicId: 'some-name',
      systemId: 'some-name'
    };
    const expected = {...node};

    main.setTextContent(node, 'bleep');

    assert.deepStrictEqual(node, expected);
  });
});
