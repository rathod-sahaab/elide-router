import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateVisitPayload, Visit } from '../entities/visit.model'

export class Location {
	country: string
	region: string
	coordinates: number[]
}

@Injectable()
export class VisitsRepository {
	constructor(@InjectModel(Visit.name) private readonly visitModel: Model<Visit>) {}

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
		return this.visitModel.create(<CreateVisitPayload>{
			linkId,
			visitorId,
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

