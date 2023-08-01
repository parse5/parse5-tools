import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {html} from 'parse5';
import type {Element} from '../nodeTypes.js';

test('setAttribute', async (t) => {
  await t.test('adds attribute to elemet attrs', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    main.setAttribute(node, 'ping-pong', 'boing');

    assert.deepStrictEqual(node.attrs, [{name: 'ping-pong', value: 'boing'}]);
  });
});

test('getAttribute', async (t) => {
  await t.test('retrieves specified attribute value', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'some-attr');

    assert.strictEqual(result, 'some-value');
  });

  await t.test('null if attribute does not exist', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'non-existent');

    assert.strictEqual(result, null);
  });

  await t.test('retrieves empty string values', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: ''}],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.getAttribute(node, 'some-attr');

    assert.strictEqual(result, '');
  });
});

test('hasAttribute', async (t) => {
  await t.test('true if specified attribute exists', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.hasAttribute(node, 'some-attr');

    assert.strictEqual(result, true);
  });

  await t.test('false if specified attribute does not exist', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.hasAttribute(node, 'some-attr');

    assert.strictEqual(result, false);
  });
});

test('removeAttribute', async (t) => {
  await t.test('removes specified attribute', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [{name: 'some-attr', value: 'some-value'}],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    main.removeAttribute(node, 'some-attr');

    assert.strictEqual(node.attrs.length, 0);
  });

  await t.test('ignores already missing attributes', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    main.removeAttribute(node, 'some-attr');

    assert.strictEqual(node.attrs.length, 0);
  });
});

test('getAttributeIndex', async (t) => {
  await t.test('retrieves index of specified attribute', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [
        {name: 'attr-0', value: 'some-value'},
        {name: 'attr-1', value: 'some-value'}
      ],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const index0 = main.getAttributeIndex(node, 'attr-0');
    const index1 = main.getAttributeIndex(node, 'attr-1');

    assert.strictEqual(index0, 0);
    assert.strictEqual(index1, 1);
  });

  await t.test('-1 if attribute missing', () => {
    const node: Element = {
      nodeName: 'div',
      parentNode: null,
      tagName: 'div',
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    };

    const result = main.getAttributeIndex(node, 'some-attr');

    assert.strictEqual(result, -1);
  });
});
