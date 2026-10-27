<script setup>
import { nextTick, ref, watch } from 'vue';
const props = defineProps({ messages: { type: Array, required: true }, active: { type: Boolean, default: true } });
const viewport = ref(null);
watch([() => props.messages.length, () => props.active], async () => {
  await nextTick();
  if (props.active && viewport.value) viewport.value.scrollTop = viewport.value.scrollHeight;
});
</script>
<template>
  <div ref="viewport" class="h-[min(52dvh,520px)] min-h-64 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
    <div v-if="!messages.length" class="flex h-full flex-col items-center justify-center text-center">
      <span aria-hidden="true" class="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-3xl text-teal-700">#</span>
      <h3 class="text-xl font-semibold">La conversation commence ici.</h3>
      <p class="mt-3 max-w-xs text-sm leading-6 text-slate-500">Écrivez votre premier message. Le serveur le transmettra aux clients connectés, vous compris.</p>
    </div>
    <ol v-else aria-label="Messages reçus" aria-live="polite" aria-relevant="additions" class="space-y-5">
      <li v-for="message in messages" :key="message.id" :class="message.isOwn ? 'justify-start' : 'justify-end'" class="flex gap-3">
        <div class="min-w-0 max-w-[85%] sm:max-w-[75%]">
          <p :class="message.isOwn ? 'text-left' : 'text-right'" class="mb-1.5 text-xs text-slate-500">{{ message.senderName || 'Client ' + message.senderId.slice(0, 8) }}<span v-if="message.isOwn" class="ml-1">(vous)</span> <span aria-hidden="true" class="mx-1">·</span> <time :datetime="message.createdAt">{{ new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</time></p>
          <p :class="message.isOwn ? 'rounded-tl-sm bg-teal-800 text-white' : 'rounded-tr-sm bg-slate-100 text-slate-800'" class="whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6">{{ message.content }}</p>
          <p :class="message.isOwn ? 'text-left' : 'text-right'" class="mt-1.5 text-[11px] text-slate-400" :title="'Message : ' + message.id + ' · Connexion émettrice : ' + message.senderId">Reçu par le serveur <span aria-hidden="true">✓</span></p>
        </div>
      </li>
    </ol>
  </div>
</template>
