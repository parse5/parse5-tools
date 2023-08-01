import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {defaultTreeAdapter, html} from 'parse5';
import type {Document, TextNode, DocumentFragment} from '../nodeTypes.js';

test('removeNode', async (t) => {
  await t.test('does nothing if not a child', () => {
    const node: Document = {
      nodeName: '#document',
      childNodes: [],
      mode: html.DOCUMENT_MODE.NO_QUIRKS
    };
    const original = {...node};

    main.removeNode(node);

    assert.deepStrictEqual(original, node);
  });

  await t.test('removes specified node', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: '010'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    child1.parentNode = node;

    main.removeNode(child1);

    assert.strictEqual(child1.parentNode, null);
    assert.strictEqual(node.childNodes.length, 0);
  });
});

test('appendChild', async (t) => {
  await t.test('delegates to default adapter', () => {
    assert.strictEqual(main.appendChild, defaultTreeAdapter.appendChild);
  });
});

test('spliceChildren', async (t) => {
  await t.test('deletes without new children', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: '001'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: '010'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(node.childNodes.length, 1);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child1);
  });

  await t.test('deletes from specified index', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2, child3]
    };

    const result = main.spliceChildren(node, 1, 1);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('appends without deleting if deleteCount is 0', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 0, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child2);
    assert.strictEqual(node.childNodes[1], child1);
    assert.strictEqual(result.length, 0);
  });

  await t.test('appends at specified index', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1]
    };

    const result = main.spliceChildren(node, 1, 0, child2);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child2);
    assert.strictEqual(result.length, 0);
  });

  await t.test('deletes then appends new children', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2]
    };

    const result = main.spliceChildren(node, 1, 1, child3);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], child2);
  });

  await t.test('ignores nodes which are not parent nodes', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };
    const result = main.spliceChildren(node, 0, 1);

    assert.strictEqual(result.length, 0);
  });
});

test('replaceWith', async (t) => {
  await t.test('ignores nodes which have no parent', () => {
    const node: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'some text'
    };

    main.replaceWith(node, {
      nodeName: '#text',
      parentNode: null,
      value: 'some other text'
    });

    assert.strictEqual(node.parentNode, null);
  });

  await t.test('replaces node with specified nodes', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const child3: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'three'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: [child1, child2]
    };

    child1.parentNode = node;
    child2.parentNode = node;

    main.replaceWith(child2, child3);

    assert.strictEqual(node.childNodes.length, 2);
    assert.strictEqual(node.childNodes[0], child1);
    assert.strictEqual(node.childNodes[1], child3);
    assert.strictEqual(child3.parentNode, node);
    assert.strictEqual(child2.parentNode, null);
  });

  await t.test('leaves childNodes untouched if child missing', () => {
    const child1: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'one'
    };
    const child2: TextNode = {
      nodeName: '#text',
      parentNode: null,
      value: 'two'
    };
    const node: DocumentFragment = {
      nodeName: '#document-fragment',
      childNodes: []
    };

    child1.parentNode = node;

    main.replaceWith(child1, child2);

    assert.strictEqual(node.childNodes.length, 0);
    assert.strictEqual(child1.parentNode, null);
  });
});
