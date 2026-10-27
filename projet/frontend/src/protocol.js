// Fourni : JSON valide ne signifie pas message conforme au contrat.
export function isChatMessage(value) {
  const data = value?.data;
  return value?.event === 'chat:message'
    && typeof data?.id === 'string' && data.id.trim().length > 0
    && typeof data?.senderId === 'string' && data.senderId.trim().length > 0
    && (data?.senderName === undefined || (typeof data.senderName === 'string' && data.senderName.length <= 32))
    && typeof data?.content === 'string' && data.content.trim().length > 0
    && data.content.length <= 500
    && typeof data?.createdAt === 'string'
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(data.createdAt)
    && Number.isFinite(Date.parse(data.createdAt));
}
