export interface AnalyticsData {
	linkId: number
	visitorJwt: string
	referer?: string
	ip: string
	time: Date
	userAgent?: string
}
