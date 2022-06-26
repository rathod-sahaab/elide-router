// TODO: use this
export interface EnvironmentVariables {
	NODE_ENV: string
	PORT: number
	JWT_ACCESS_TOKEN_SECRET: string
}

export default (): { port: number; node_env: string } => ({
	port: parseInt(process.env.PORT, 10) || 3000,
	node_env: process.env.NODE_ENV || 'development',
})
