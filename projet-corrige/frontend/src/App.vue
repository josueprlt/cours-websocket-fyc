<script setup>
import { ref } from 'vue';
import { useChat } from './useChat';
import MessageList from './MessageList.vue';
import { responseFixtures } from './responseFixtures';
const panel = ref('chat');
const { url, readyState, information, journal, label, canConnect, canClose, connect, disconnect, draft, messages, notice, sendMessage, receiveMessage } = useChat();
</script>

<template>
  <main class="mx-auto max-w-6xl px-3 py-5 sm:px-8 sm:py-10">
    <header class="mb-6 flex items-center justify-between gap-4">
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Atelier WebSocket / 03</p>
        <h1 class="text-3xl font-semibold tracking-tight">Le Salon<span class="text-teal-600">.</span></h1>
      </div>
      <span class="hidden text-sm text-slate-500 sm:block">Un espace pour échanger.</span>
    </header>

    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid md:grid-cols-[210px_minmax(0,1fr)]">
      <aside class="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-[#eaf0eb] p-4 md:flex-col md:items-stretch md:border-b-0 md:border-r md:p-5">
        <p class="hidden px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-widest text-slate-500 md:block">Votre espace</p>
        <nav aria-label="Navigation du salon" class="flex gap-2 md:flex-col">
          <button type="button" @click="panel = 'chat'" :aria-pressed="panel === 'chat'" :class="panel === 'chat' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:bg-white/60'" class="rounded-xl px-4 py-3 text-left font-semibold"><span aria-hidden="true" class="mr-2 text-teal-600">#</span> général</button>
          <button type="button" @click="panel = 'tools'" :aria-pressed="panel === 'tools'" :class="panel === 'tools' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:bg-white/60'" class="rounded-xl px-4 py-3 text-left text-sm font-medium"><span aria-hidden="true" class="mr-2">⚙</span> Atelier</button>
        </nav>
        <div class="ml-auto flex items-center gap-3 md:ml-0 md:mt-auto md:border-t md:border-slate-300 md:pt-5">
          <span aria-hidden="true" class="flex h-9 w-9 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white">VO</span>
          <div><p class="text-sm font-semibold">Vous</p><p class="text-xs text-slate-500">Espace de pratique</p></div>
        </div>
      </aside>

      <section v-show="panel === 'chat'" aria-labelledby="chat-title" class="flex min-w-0 flex-col">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-8">
          <div><h2 id="chat-title" class="text-lg font-semibold"><span class="mr-2 text-teal-600">#</span> général</h2><p class="mt-1 text-xs text-slate-500">Votre conversation avec le serveur</p></div>
          <p role="status" class="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-medium"><span aria-hidden="true" class="h-2 w-2 rounded-full" :class="canClose ? 'bg-teal-500' : 'bg-amber-500'"></span>{{ label }}</p>
        </header>
        <div v-if="canConnect" role="status" class="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-900">
          <span>Connexion indisponible. Vérifiez que le serveur est démarré.</span>
          <button type="button" @click="connect" class="rounded-lg border border-amber-300 px-3 py-2 font-semibold">Réessayer</button>
        </div>
        <MessageList :messages="messages" :active="panel === 'chat'" />
        <form @submit.prevent="sendMessage" class="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-8">
          <label for="draft" class="sr-only">Votre message</label>
          <div class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-teal-600">
            <input id="draft" v-model="draft" maxlength="500" autocomplete="off" aria-describedby="send-notice" class="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" placeholder="Écrivez dans #général…" />
            <button type="submit" :disabled="!canClose" class="shrink-0 rounded-xl bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:opacity-40">Envoyer <span aria-hidden="true" class="ml-1">↗</span></button>
          </div>
          <div class="mt-3 flex justify-between gap-3 text-xs text-slate-500">
            <p id="send-notice" role="status">{{ notice }}</p>
            <span class="shrink-0">{{ draft.length }} / 500</span>
          </div>
        </form>
      </section>

      <section v-show="panel === 'tools'" aria-labelledby="tools-title" class="min-w-0 p-5 sm:p-8">
        <h2 id="tools-title" class="text-xl font-semibold">Atelier</h2>
        <p class="mt-2 text-sm text-slate-500">Les outils pour observer les échanges et tester votre code.</p>
        <section aria-labelledby="connection-title" class="mt-6 rounded-2xl border border-slate-200 p-5">
          <h3 id="connection-title" class="font-semibold">Connexion au serveur</h3>
          <p class="mt-2 text-sm text-slate-500">L’ouverture est automatique au chargement. Vous pouvez la piloter ici pour les tests.</p>
          <form @submit.prevent="connect" class="mt-4">
            <label for="url" class="mb-2 block text-sm font-medium">Adresse WebSocket</label>
            <input id="url" v-model="url" :disabled="!canConnect" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100" spellcheck="false" autocomplete="off" />
            <div class="mt-3 flex flex-wrap gap-2">
              <button type="submit" :disabled="!canConnect" class="rounded-xl bg-teal-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Connecter</button>
              <button type="button" @click="disconnect" :disabled="!canClose" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40">Déconnecter</button>
            </div>
          </form>
          <p class="mt-3 text-xs text-slate-500">{{ label }} · état {{ readyState ?? '—' }}</p>
          <p role="status" class="mt-2 text-sm">{{ information }}</p>
        </section>
        <section aria-labelledby="fixtures-title" class="mt-4 rounded-2xl border border-slate-200 p-5">
          <h3 id="fixtures-title" class="font-semibold">Simuler une réponse reçue</h3>
          <p class="my-3 text-sm text-slate-500">Injection locale, sans envoi réseau. À utiliser après les TODO 5 à 7.</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="fixture in responseFixtures" :key="fixture.label" type="button" @click="receiveMessage({ data: fixture.raw })" class="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">{{ fixture.label }}</button>
          </div>
          <p role="status" class="mt-3 text-sm">{{ notice }}</p>
        </section>
        <details class="mt-4 rounded-2xl border border-slate-200 p-5">
          <summary class="cursor-pointer font-semibold">Journal de connexion</summary>
          <p class="mt-2 text-xs text-slate-500">Les 12 dernières observations de cette fenêtre.</p>
          <p v-if="!journal.length" class="mt-3 text-sm text-slate-500">Aucun événement pour le moment.</p>
          <ol v-else class="mt-3 space-y-2" aria-label="Événements de connexion">
            <li v-for="(entry, index) in journal" :key="index" class="break-words rounded-lg bg-slate-50 p-3 text-xs"><strong>{{ entry.event }}</strong> · état {{ entry.state ?? '—' }}<span v-if="entry.detail" class="mt-1 block text-slate-500">{{ entry.detail }}</span></li>
          </ol>
        </details>
      </section>
    </div>
    <footer class="mt-4 text-center text-xs text-slate-500">S3 · Les messages restent dans cet onglet le temps de votre visite.</footer>
  </main>
</template>
