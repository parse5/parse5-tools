import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as main from '../main.js';
import {defaultTreeAdapter, html} from 'parse5';

test('createElement', async (t) => {
  await t.test('creates an element', () => {
    const node = main.createElement('div');

    assert.strictEqual(node.nodeName, 'div');
    assert.strictEqual(node.attrs.length, 0);
    assert.strictEqual(node.namespaceURI, html.NS.HTML);
  });

  await t.test('creates an element with specified attrs', () => {
    const node = main.createElement(
      'div',
      [
        {name: 'foo', value: 'piwo'},
        {name: 'bar', value: 'mleko'}
      ],
      html.NS.HTML
    );

    assert.strictEqual(node.attrs.length, 2);
    assert.deepStrictEqual(node.attrs, [
      {name: 'foo', value: 'piwo'},
      {name: 'bar', value: 'mleko'}
    ]);
  });

  await t.test('creates an element with specified attrs as object', () => {
    const node = main.createElement(
      'div',
      {
        foo: 'piwo',
        bar: 'mleko'
      },
      html.NS.HTML
    );

    assert.strictEqual(node.attrs.length, 2);
    assert.deepStrictEqual(node.attrs, [
      {name: 'foo', value: 'piwo'},
      {name: 'bar', value: 'mleko'}
    ]);
  });

  await t.test('creates an element with specified namespace', () => {
    const node = main.createElement('div', [], html.NS.XML);

    assert.strictEqual(node.namespaceURI, html.NS.XML);
  });

  await t.test('creates an element using namespace shortcut', () => {
    const node = main.createElement('div', [], 'xml');

    assert.strictEqual(node.namespaceURI, html.NS.XML);
  });
});

test('createTextNode', async (t) => {
  await t.test('creates a text node', () => {
    const node = main.createTextNode('bacon');

    assert.deepStrictEqual(node, {
      nodeName: '#text',
      value: 'bacon',
      parentNode: null
    });
  });
});

test('createDocumentFragment', async (t) => {
  await t.test('creates a document fragment', () => {
    const node = main.createDocumentFragment();

    assert.strictEqual(node.nodeName, '#document-fragment');
    assert.strictEqual(node.childNodes.length, 0);
  });
});

test('createTemplateNode', async (t) => {
  await t.test('creates a template node', () => {
    const node = main.createTemplateNode();

    assert.deepStrictEqual(node, {
      nodeName: 'template',
      tagName: 'template',
      content: {
        nodeName: '#document-fragment',
        childNodes: []
      },
      parentNode: null,
      attrs: [],
      namespaceURI: html.NS.HTML,
      childNodes: []
    });
  });

  await t.test('creates a template with contents', () => {
    const contents = defaultTreeAdapter.createDocumentFragment();
    const node = main.createTemplateNode(contents);

    assert.strictEqual(node.content, contents);
  });
});

test('createDocument', async (t) => {
  await t.test('creates a document', () => {
    const node = main.createDocument();

    assert.strictEqual(node.nodeName, '#document');
    assert.strictEqual(node.childNodes.length, 0);
  });
});

test('createCommentNode', async (t) => {
  await t.test('creates a comment node', () => {
    const node = main.createCommentNode('cheese');

    assert.strictEqual(node.nodeName, '#comment');
    assert.strictEqual(node.data, 'cheese');
  });
});
