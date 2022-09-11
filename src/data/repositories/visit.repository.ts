import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateVisitPayload, Visit } from '../entities/visit.model'
import { UniqueVisitor } from '../entities/visitor.model'

export class Location {
	country: string
	region: string
	coordinates: number[]
}

@Injectable()
export class VisitsRepository {
	constructor(
		@InjectModel(Visit.name) private readonly visitModel: Model<Visit>,
		@InjectModel(UniqueVisitor.name) private readonly uniqueVistorModel: Model<UniqueVisitor>,
	) {}

	async wrtTime({
		linkId,
		filters,
	}: {
		linkId: number
		filters: { startHrs: number; endHrs: number }
	}): Promise<
		{
			time: {
				year: number
				month: number
				day: number
				hour: number
			}
			visits: number
			uniqueVisitors: number
		}[]
	> {
		const timeFilter: any = {
			$gte: new Date(Date.now() - filters.startHrs * 60 * 60 * 1000),
		}

		if (filters.endHrs > 0) {
			timeFilter.$lte = new Date(Date.now() - filters.endHrs * 60 * 60 * 1000)
		}

		return await this.visitModel
			.aggregate()
			.match({
				linkId,
				time: timeFilter,
			})
			.sort({
				time: -1,
			})
			.group({
				_id: {
					// TODO: group by 5 minutes
					year: { $year: '$time' },
					month: { $month: '$time' },
					day: { $dayOfMonth: '$time' },
					hour: { $hour: '$time' },
				},
				visits: {
					$sum: 1,
				},
				uniqueVisitors: {
					// TODO: might not work for booleans
					$sum: { $cond: ['$unique', 1, 0] },
				},
			})
			.sort({
				_id: 1,
			})
			.project({
				_id: 0,
				time: '$_id',
				visits: 1,
				uniqueVisitors: 1,
			})
	}

	async create({
		linkId,
		visitorId,
		time,
		referer,
		userAgent,
		location,
	}: {
		linkId: number
		visitorId: Types.ObjectId
		time: Date
		location?: Location
		referer?: string
		userAgent?: {
			browser: string
			os: string
			device: string
			source: string
		}
	}) {
		const uniqueVisitor = await this.uniqueVistorModel.findOne({ linkId, visitorId })

		if (!uniqueVisitor) {
			await this.uniqueVistorModel.create({
				linkId,
				visitorId,
			})
		}

		return this.visitModel.create(<CreateVisitPayload>{
			linkId,
			unique: !uniqueVisitor,
			time,
			referer,
			userAgent,
			location: location
				? {
						country: location.country,
						region: location.region,
						geoPoint: {
							type: 'Point',
							coordinates: location.coordinates,
						},
				  }
				: undefined,
		})
	}

	// TODO: wrtCountry, wrtCountryRegion
}
