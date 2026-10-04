<script setup>
import { ref } from 'vue';

// Données de démonstration : aucun backend ni envoi réseau dans cette séquence.
const projectTitle = 'Le Salon';
const draft = ref('');
const notice = ref('');
const messages = [
  { id: 1, author: 'Camille', content: 'Bienvenue dans notre futur espace de discussion !', time: '09:41' },
  { id: 2, author: 'Alex', content: 'Pour le moment, ces messages sont des données de démonstration.', time: '09:42' },
  { id: 3, author: 'Camille', content: 'Notre défi : faire circuler de vrais messages entre deux navigateurs.', time: '09:43' },
];

function previewOnly() {
  notice.value = draft.value.trim()
    ? 'Aperçu uniquement : votre texte n’a pas été envoyé. Le serveur sera construit à la séquence 2.'
    : 'Saisissez un texte pour explorer le formulaire. Aucun message ne sera envoyé.';
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-5 py-8 sm:px-10 sm:py-12">
    <header class="mb-9 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Atelier WebSocket / 01</p>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{{ projectTitle }}</h1>
        <p class="mt-3 text-slate-600">Une interface aujourd’hui. Une conversation en temps réel demain.</p>
      </div>
      <span class="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">Mode statique · aucun serveur de chat</span>
    </header>

    <div class="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[230px_1fr]">
      <aside class="border-b border-slate-200 bg-[#eaf0eb] p-6 md:border-r md:border-b-0">
        <h2 class="mb-5 text-xs font-bold uppercase tracking-widest text-slate-600">Espace de travail</h2>
        <div class="rounded-xl bg-white px-4 py-3 font-semibold text-teal-900"># general</div>
        <p class="mt-5 text-sm leading-6 text-slate-600">Le choix des salons arrivera à la séquence 7.</p>
        <div class="mt-8 border-t border-slate-300 pt-5 text-sm leading-6">
          <p class="font-semibold">Votre mission</p>
          <p class="mt-2 text-slate-600">Lancer le projet, repérer les composants et comprendre ce qu’il reste à connecter.</p>
        </div>
      </aside>

      <section aria-labelledby="conversation-title" class="flex min-w-0 flex-col">
        <div class="border-b border-slate-200 px-6 py-5">
          <h2 id="conversation-title" class="text-lg font-semibold">Le début de la conversation</h2>
          <p class="mt-1 text-sm text-slate-500">3 messages fictifs · aucune présence réelle</p>
        </div>
        <ol class="flex-1 space-y-6 p-6 sm:p-8" aria-label="Messages de démonstration">
          <li v-for="message in messages" :key="message.id" class="flex gap-3">
            <div aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800">{{ message.author[0] }}</div>
            <div class="min-w-0">
              <p class="mb-2 text-sm"><strong>{{ message.author }}</strong><span class="ml-3 text-slate-500">{{ message.time }}</span></p>
              <p class="max-w-lg rounded-2xl rounded-tl-none bg-slate-100 px-4 py-3 leading-6">{{ message.content }}</p>
            </div>
          </li>
        </ol>
        <form @submit.prevent="previewOnly" class="border-t border-slate-200 p-6">
          <label for="draft" class="mb-2 block text-sm font-semibold">Votre message</label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input id="draft" v-model="draft" maxlength="500" autocomplete="off" placeholder="Écrivez quelques mots…" aria-describedby="form-help form-notice" class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3" />
            <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 font-semibold text-white hover:bg-teal-900">Envoyer (démo)</button>
          </div>
          <p id="form-help" class="mt-3 text-xs leading-5 text-slate-500">Le bouton affiche une explication locale. Aucune transmission ni sauvegarde.</p>
          <p id="form-notice" role="status" class="mt-2 text-sm font-medium text-teal-800">{{ notice }}</p>
        </form>
      </section>
    </div>
    <footer class="mt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-500"><span>Vue 3 · Tailwind CSS · Vite</span><span>Séquence 1 / Onboarding & positionnement</span></footer>
  </main>
</template>
