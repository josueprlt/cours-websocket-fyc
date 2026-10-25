import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
const require = createRequire(import.meta.url);
require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { WsAdapter } = require('@nestjs/platform-ws');
const { AppModule } = require('../backend/dist/app.module.js');
const WebSocket = require('ws');

async function reply(socket, content) {
  const received = once(socket, 'message');
  socket.send(JSON.stringify({ event: 'chat:send', data: { content } }));
  const [raw] = await received;
  return JSON.parse(raw.toString());
}

test('aller-retour réel : métadonnées, validation et réponse à l’émetteur', { timeout: 10000 }, async () => {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useWebSocketAdapter(new WsAdapter(app));
  const sockets = [];
  try {
    await app.listen(0, '127.0.0.1');
    const url = `ws://127.0.0.1:${app.getHttpServer().address().port}/chat`;
    const sender = new WebSocket(url);
    sockets.push(sender);
    await once(sender, 'open');
    const other = new WebSocket(url);
    sockets.push(other);
    await once(other, 'open');
    let othersReceived = 0;
    other.on('message', () => othersReceived++);
    const ids = new Set();
    for (const content of ['  Salut 👋 — café  ', 'Un', 'Deux', 'Un', '<b>Bonjour</b>', 'a'.repeat(500)]) {
      const before = Date.now();
      const result = await reply(sender, content);
      assert.equal(result.event, 'chat:message');
      assert.equal(result.data.content, content.trim());
      assert.match(result.data.id, /^[0-9a-f-]{36}$/);
      assert.ok(!ids.has(result.data.id));
      ids.add(result.data.id);
      assert.ok(Date.parse(result.data.createdAt) >= before);
      assert.ok(Date.parse(result.data.createdAt) <= Date.now());
    }
    for (const content of ['', '   ', 42, null, 'a'.repeat(501)]) {
      assert.equal((await reply(sender, content)).event, 'chat:error');
    }
    assert.equal((await reply(sender, 'Après le refus')).data.content, 'Après le refus');
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal(othersReceived, 0);
  } finally {
    for (const socket of sockets) socket.terminate();
    await app.close();
  }
});
