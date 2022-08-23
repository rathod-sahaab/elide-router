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

	async findForLink({ linkId }: { linkId: number }) {
		return this.visitModel.find({ linkId }).lean<Visit[]>
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
		userAgent?: string
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
}
