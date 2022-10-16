import { Types } from 'mongoose'

export interface AnalyticsData {
	linkId: number
	visitorId: string
	referer?: string
	ip: string
	time: Date
	userAgent?: string
}
