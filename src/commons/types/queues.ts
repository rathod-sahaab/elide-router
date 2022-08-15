export const QUEUES = ['visits'] as const

export type QueueType = typeof QUEUES[number]

export const VISITS_QUEUE: QueueType = 'visits' as const

export const VISITS_QUEUES_ANALYTICS = 'analytics' as const
