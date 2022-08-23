import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

const UniqueVisitorCollectionName = 'unique_visitor'
@Schema({
	collection: UniqueVisitorCollectionName,
})
export class UniqueVisitor {
	_id: Types.ObjectId

	@Prop({ required: true })
	linkId: number

	@Prop({ type: Types.ObjectId, required: true })
	visitorId: Types.ObjectId
}

export type CreateUniqueVistorPayload = Omit<UniqueVisitor, '_id'>

export type UniqueVisitDocument = UniqueVisitor & Document

export const UniqueVisitorSchema = SchemaFactory.createForClass(UniqueVisitor)
