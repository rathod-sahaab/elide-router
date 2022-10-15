import { getLinkCacheKey } from './cache-keys'

describe('getLinkCacheKey', () => {
	it('should return the link cache key', () => {
		expect(getLinkCacheKey('random_slug')).toBe('slug_random_slug')
	})
})
