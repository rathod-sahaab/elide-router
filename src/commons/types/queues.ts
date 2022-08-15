export const QUEUES = ['visits'] as const

export type QueueType = typeof QUEUES[number]

export const VISITS_QUEUE: QueueType = 'visits'
