import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Visit, VisitDocument } from './models/visit.model'

@Injectable()
export class AnalyticsService {
	constructor(@InjectModel(Visit.name) private readonly visitModel: Model<VisitDocument>) {}

	async findAll() {
		const visits = await this.visitModel.find({}).lean<Visit[]>()
		return visits
	}
}
