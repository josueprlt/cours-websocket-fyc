<script setup>
import { useConnection } from './useConnection';
const { url, readyState, information, journal, label, canConnect, canClose, connect, disconnect } = useConnection();
</script>

<template>
  <main class="mx-auto max-w-5xl px-5 py-10 sm:px-10">
    <header class="mb-8">
      <p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Atelier WebSocket / 02</p>
      <h1 class="text-4xl font-semibold tracking-tight">Le Salon · La connexion</h1>
      <p class="mt-3 text-slate-600">Ouvrir, observer, fermer. Les messages arriveront à la séquence 3.</p>
    </header>
    <section aria-labelledby="connection-title" class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="connection-title" class="text-xl font-semibold">Connexion au serveur</h2>
        <p role="status" class="rounded-full bg-teal-50 px-4 py-2 font-semibold text-teal-900">{{ label }}</p>
      </div>
      <form @submit.prevent="connect">
        <label for="url" class="mb-2 block text-sm font-semibold">Adresse WebSocket</label>
        <input id="url" v-model="url" :disabled="!canConnect" class="w-full rounded-xl border border-slate-300 px-4 py-3 disabled:bg-slate-100" spellcheck="false" autocomplete="off" />
        <div class="mt-4 flex flex-wrap gap-3">
          <button type="submit" :disabled="!canConnect" class="rounded-xl bg-teal-800 px-5 py-3 font-semibold text-white disabled:opacity-40">Connecter</button>
          <button type="button" @click="disconnect" :disabled="!canClose" class="rounded-xl border border-slate-400 px-5 py-3 font-semibold disabled:opacity-40">Déconnecter</button>
        </div>
      </form>
      <p class="mt-5 text-sm text-slate-600">État observé : <strong>{{ readyState === null ? 'aucune tentative' : readyState }}</strong></p>
      <p role="status" class="mt-2 min-h-12 text-sm leading-6">{{ information }}</p>
    </section>
    <section aria-labelledby="journal-title" class="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 id="journal-title" class="text-xl font-semibold">Journal de connexion</h2>
      <p class="mt-2 text-sm text-slate-600">Les 12 dernières observations de cette fenêtre, dans l’ordre.</p>
      <p v-if="!journal.length" class="mt-5 text-slate-500">Aucun événement pour le moment.</p>
      <ol v-else class="mt-5 space-y-3" aria-label="Événements de connexion">
        <li v-for="(entry, index) in journal" :key="index" class="rounded-xl bg-slate-50 px-4 py-3 text-sm break-words">
          <strong>{{ entry.event }}</strong> · état {{ entry.state ?? '—' }}
          <span v-if="entry.detail" class="mt-1 block text-slate-600">{{ entry.detail }}</span>
        </li>
      </ol>
    </section>
    <footer class="mt-6 text-sm text-slate-500">S2 · Aucune transmission de message ni reconnexion automatique</footer>
  </main>
</template>
