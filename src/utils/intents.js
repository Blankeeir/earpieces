export const INTENTS = [
  { id: 'looking', label: 'Looking for other half' },
  { id: 'offering', label: 'Offering my half' },
  { id: 'selling', label: 'Selling' },
  { id: 'giving', label: 'Giving away' },
]

export function intentBadge(intent) {
  switch (intent) {
    case 'looking':
      return 'bg-sky-100 text-sky-700'
    case 'offering':
      return 'bg-lime-100 text-lime-700'
    case 'selling':
      return 'bg-orange-100 text-orange-700'
    case 'giving':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
