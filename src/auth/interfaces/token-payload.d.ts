export class TokenPayload {
	public sub: number
	public email: string
}

export class RefreshTokenPayload {
	public tokenId: string
	public accessTokenPayload: TokenPayload
}
