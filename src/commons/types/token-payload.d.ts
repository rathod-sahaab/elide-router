export class TokenPayload {
	public sub: number // user id
	public email: string
	public verified: boolean
}

export class RefreshTokenPayload {
	public tokenId: string
	public sub: number // user id
	public accessTokenPayload: TokenPayload
}

export class EmailVerificationPayload {
	public sub: number // user id
	public email: string // user email
}

export class ForgotPasswordPayload {
	public sub: number // user id
	public email: string // user email
}
