export default function formatReactionUsers(reactions, getName, noNamedReactions) {
  const names = reactions.slice(0, 10).map(getName).filter(Boolean);

  if (!names.length) return noNamedReactions;

  return names.join('\n') + (reactions.length > 10 ? '\n...' : '');
}
