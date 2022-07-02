import { Min } from 'class-validator'

export class DeleteLinkParams {
	@Min(1)
	linkId: number
}
