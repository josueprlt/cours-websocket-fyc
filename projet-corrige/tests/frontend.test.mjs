import test from 'node:test';
import assert from 'node:assert/strict';
import { createRenderer } from 'vue';
import { useChat } from '../frontend/src/useChat.js';
import { responseFixtures } from '../frontend/src/responseFixtures.js';

class FakeSocket extends EventTarget {
  static OPEN = 1;
  static CLOSED = 3;
  static CLOSING = 2;
  static instances = [];
  readyState = 0;
  sent = [];
  constructor() { super(); FakeSocket.instances.push(this); }
  send(raw) { this.sent.push(raw); }
  open() { this.readyState = 1; this.dispatchEvent(new Event('open')); }
  close() { this.readyState = 3; this.dispatchEvent(new Event('close')); }
  receive(data) { this.dispatchEvent(new MessageEvent('message', { data })); }
}

const renderer = createRenderer({
  createComment: () => ({}), insert() {}, remove() {}, parentNode() {}, nextSibling() {},
});

test('gestionnaires Vue : garde, sérialisation, réception, erreurs et reconnexion', () => {
  const original = globalThis.WebSocket;
  globalThis.WebSocket = FakeSocket;
  let chat;
  const app = renderer.createApp({ setup() { chat = useChat(); return () => null; } });
  app.mount({});
  try {
    const initialSocket = FakeSocket.instances.at(-1);
    assert.equal(chat.getSocket(), initialSocket);
    assert.equal(initialSocket.readyState, 0); // ouverture automatique au montage
    const count = FakeSocket.instances.length;
    chat.connect();
    assert.equal(FakeSocket.instances.length, count); // pas de deuxième connexion
    chat.draft.value = 'Bonjour';
    chat.sendMessage();
    assert.equal(chat.draft.value, 'Bonjour');
    assert.match(chat.notice.value, /Ouvrez/);
    chat.connect();
    const socket = FakeSocket.instances.at(-1);
    chat.sendMessage();
    assert.equal(socket.sent.length, 0); // CONNECTING
    socket.open();
    chat.sendMessage();
    assert.deepEqual(JSON.parse(socket.sent[0]), { event: 'chat:send', data: { content: 'Bonjour', senderName: 'Vous' } });
    assert.equal(chat.draft.value, '');
    assert.equal(chat.messages.value.length, 0); // aucun ajout optimiste
    const valid = JSON.stringify({ event: 'chat:message', data: { id: 'test-1', senderId: 'client-a', content: 'Bonjour', createdAt: '2026-10-21T10:00:00.000Z' } });
    socket.receive(JSON.stringify({ event: 'chat:welcome', data: { senderId: 'client-a' } }));
    assert.equal(chat.messages.value.length, 0);
    socket.receive(valid);
    assert.equal(chat.messages.value[0].isOwn, true);
    assert.equal(chat.messages.value.length, 1);
    for (const fixture of responseFixtures) {
      socket.receive(fixture.raw);
      assert.match(chat.notice.value, /invalide/);
      assert.equal(chat.messages.value.length, 1);
    }
    socket.receive(valid.replace('senderId', 'unknownAuthor'));
    assert.equal(chat.messages.value.length, 1);
    assert.match(chat.notice.value, /invalide/);
    socket.receive(new ArrayBuffer(2));
    assert.match(chat.notice.value, /invalide/);
    socket.receive(JSON.stringify({ event: 'chat:error', data: { message: 'Refus du serveur' } }));
    assert.equal(chat.notice.value, 'Refus du serveur');
    assert.equal(chat.messages.value.length, 1);
    for (const text of ['   ', 'a'.repeat(501)]) {
      chat.draft.value = text;
      chat.sendMessage();
      assert.equal(socket.sent.length, 1);
      assert.equal(chat.draft.value, text);
    }
    chat.disconnect();
    chat.connect();
    const next = FakeSocket.instances.at(-1);
    next.open();
    socket.receive(valid); // ancien écouteur retiré
    assert.equal(chat.messages.value.length, 1);
    next.receive(valid.replace('test-1', 'test-2'));
    assert.equal(chat.messages.value.length, 2);
    next.receive(valid.replace('client-a', 'client-b').replace('test-1', 'test-3'));
    assert.equal(chat.messages.value.at(-1).isOwn, false);
    chat.username.value = '  Alice  ';
    chat.draft.value = 'Nouveau nom';
    chat.sendMessage();
    assert.equal(JSON.parse(next.sent.at(-1)).data.senderName, 'Alice');
    app.unmount();
    next.receive(valid);
    assert.equal(chat.messages.value.length, 3);
    assert.equal(next.readyState, FakeSocket.CLOSED);
  } finally {
    globalThis.WebSocket = original;
  }
});
