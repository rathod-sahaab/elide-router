import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export const VisitCollectionName = 'visits' as const

class GeoPoint {
	@Prop({ enum: ['Point'], default: 'Point' })
	type: string

	@Prop({ type: [Number], required: true })
	coordinates: [number]
}

export class VisitModelLocation {
	@Prop({ required: true, index: true })
	country: string

	@Prop({ required: true, index: true })
	region: string

	@Prop({ type: GeoPoint, index: true })
	geoPoint: GeoPoint
}

@Schema({
	collection: VisitCollectionName,
	timeseries: {
		timeField: 'time',
		metaField: 'linkId',
		granularity: 'seconds',
	},
	// timeseries expiration
	expires: 60 * 60 * 24 /* days */ * 60,
})
export class Visit {
	_id: Types.ObjectId

	@Prop({ required: true })
	linkId: number

	@Prop({ required: true })
	time: Date

	@Prop({ required: true })
	unique: boolean

	@Prop({ type: VisitModelLocation })
	location?: VisitModelLocation

	@Prop()
	referer?: string

	@Prop()
	userAgent?: string
}

export type CreateVisitPayload = Omit<Visit, '_id'>

export type VisitDocument = Visit & Document

export const VisitSchema = SchemaFactory.createForClass(Visit)
