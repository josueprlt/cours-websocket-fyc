import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
const require = createRequire(import.meta.url);
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { WsAdapter } = require('@nestjs/platform-ws');
const { AppModule } = require('../backend/dist/app.module.js');
const { ChatGateway } = require('../backend/dist/chat.gateway.js');
const WebSocket = require('ws');

async function until(predicate) {
  for (let i = 0; i < 200; i++) {
    if (predicate()) return;
    await delay(10);
  }
  assert.fail('État attendu non atteint en 2 secondes');
}

test('trois clients : diffusion unique, auteur serveur, refus privé et nettoyage', { timeout: 15000 }, async () => {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useWebSocketAdapter(new WsAdapter(app));
  const peers = [];
  try {
    await app.listen(0, '127.0.0.1');
    const gateway = app.get(ChatGateway);
    const url = `ws://127.0.0.1:${app.getHttpServer().address().port}/chat`;
    async function connect() {
      const peer = { socket: new WebSocket(url), inbox: [] };
      peers.push(peer);
      peer.socket.on('message', raw => {
        const response = JSON.parse(raw.toString());
        if (response.event === 'chat:welcome') peer.senderId = response.data.senderId;
        else peer.inbox.push(response);
      });
      await once(peer.socket, 'open');
      await until(() => typeof peer.senderId === 'string');
      return peer;
    }
    async function broadcast(sender, content, recipients) {
      const before = peers.map(peer => peer.inbox.length);
      sender.socket.send(JSON.stringify({ event: 'chat:send', data: { content, senderId: 'forged', senderName: '  Alice  ' } }));
      await until(() => recipients.every(peer => peer.inbox.length > before[peers.indexOf(peer)]));
      await delay(60); // fenêtre d'observation d'une éventuelle seconde réponse
      for (const [i, peer] of peers.entries()) {
        assert.equal(peer.inbox.length - before[i], recipients.includes(peer) ? 1 : 0);
      }
      const message = recipients[0].inbox.at(-1);
      for (const peer of recipients) assert.deepEqual(peer.inbox.at(-1), message);
      assert.equal(message.event, 'chat:message');
      assert.equal(message.data.content, content.trim());
      assert.match(message.data.id, /^[0-9a-f-]{36}$/);
      assert.match(message.data.senderId, /^[0-9a-f-]{36}$/);
      assert.notEqual(message.data.senderId, 'forged');
      assert.equal(message.data.senderId, sender.senderId);
      assert.equal(message.data.senderName, 'Alice');
      assert.ok(Number.isFinite(Date.parse(message.data.createdAt)));
      return message.data;
    }
    async function close(peer, expectedSize) {
      const closed = once(peer.socket, 'close');
      peer.socket.close(1000, 'Test terminé');
      await closed;
      await until(() => gateway.clients.size === expectedSize);
    }
    const a = await connect(), b = await connect();
    let c = await connect();
    await until(() => gateway.clients.size === 3);
    assert.equal(new Set(gateway.clients.values()).size, 3);
    const first = await broadcast(a, '  Salut 👋 — café  ', [a, b, c]);
    const second = await broadcast(b, 'B-1', [a, b, c]);
    const third = await broadcast(c, 'C-1', [a, b, c]);
    assert.equal(new Set([first.senderId, second.senderId, third.senderId]).size, 3);
    const ids = new Set([first.id, second.id, third.id]);
    for (const text of ['Encore', 'Encore', '<b>Bonjour</b>', 'a'.repeat(500)]) {
      const data = await broadcast(a, text, [a, b, c]);
      assert.equal(data.senderId, first.senderId);
      assert.ok(!ids.has(data.id));
      ids.add(data.id);
    }
    for (const content of ['', '   ', 42, null, 'a'.repeat(501)]) {
      const before = peers.map(peer => peer.inbox.length);
      a.socket.send(JSON.stringify({ event: 'chat:send', data: { content } }));
      await until(() => a.inbox.length > before[0]);
      await delay(30);
      assert.equal(a.inbox.length, before[0] + 1);
      assert.equal(a.inbox.at(-1).event, 'chat:error');
      assert.deepEqual(peers.slice(1).map(peer => peer.inbox.length), before.slice(1));
    }
    await close(c, 2);
    await broadcast(a, 'Sans C', [a, b]);
    c = await connect();
    await until(() => gateway.clients.size === 3);
    assert.equal(c.inbox.length, 0); // aucun historique rejoué
    const returned = await broadcast(c, 'C revient', [a, b, c]);
    assert.notEqual(returned.senderId, third.senderId);
    for (let i = 0; i < 2; i++) {
      await close(c, 2);
      c = await connect();
      await until(() => gateway.clients.size === 3);
    }
    await broadcast(b, 'Après les cycles', [a, b, c]);
    await close(a, 2);
    await close(b, 1);
    await close(c, 0);
  } finally {
    for (const peer of peers) peer.socket.terminate();
    await app.close();
  }
});

test('la diffusion ignore les destinataires non OPEN et ne retourne pas une seconde réponse', () => {
  const gateway = new ChatGateway();
  const sent = [];
  const sender = { readyState: WebSocket.OPEN, send: raw => sent.push(raw) };
  gateway.handleConnection(sender);
  for (const readyState of [WebSocket.CONNECTING, WebSocket.CLOSING, WebSocket.CLOSED]) {
    gateway.handleConnection({ readyState, send(raw) { if (JSON.parse(raw).event === 'chat:welcome') return; assert.fail('Envoi vers un client non OPEN'); } });
  }
  sent.length = 0; // L’accueil privé n’est pas une diffusion.
  assert.equal(gateway.handleMessage(sender, { content: 'Bonjour' }), undefined);
  assert.equal(sent.length, 1);
  gateway.handleDisconnect(sender);
  gateway.handleDisconnect(sender);
  assert.equal(gateway.clients.size, 3); // suppression répétée sans effet sur les autres
});
