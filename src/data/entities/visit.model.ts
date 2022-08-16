import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export const VisitCollectionName = 'visits' as const

class GeoPoint {
	@Prop({ enum: ['Point'], default: 'Point' })
	type: string

	@Prop({ type: [Number], required: true })
	coordinates: [number]
}

@Schema({
	collection: VisitCollectionName,
	timeseries: {
		timeField: 'time',
		metaField: 'linkId',
		granularity: 'minutes',
	},
})
export class Visit {
	_id: Types.ObjectId

	@Prop({ required: true })
	linkId: number

	@Prop({ required: true })
	time: Date

	// TODO: more sortable
	@Prop({ required: true })
	visitorId: string

	@Prop({ type: GeoPoint, required: true })
	location: GeoPoint

	@Prop()
	referer?: string

	@Prop()
	userAgent?: string
}

export type VisitDocument = Visit & Document

export const VisitSchema = SchemaFactory.createForClass(Visit)
