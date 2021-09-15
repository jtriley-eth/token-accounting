export const getSecondsIn = (
	unit: 'hour' | 'day' | 'week' | 'year'
): number => {
	switch (unit) {
		case 'hour':
			return 60
		case 'day':
			return 86400
		case 'week':
			return 604800
		case 'year':
			return 3.154e7
	}
}

export const unixToEthTime = (timestamp: number): number => {
	return Math.floor(timestamp / 1000)
}

export const ethToUnixTime = (timestamp: number): number => {
	return timestamp * 1000
}

export const roundDownToDay = (timestamp: number): number => {
	return new Date(timestamp).setUTCHours(0, 0, 0, 0)
}

export const ethNow = () => unixToEthTime(Date.now())

export const ethToday = () => unixToEthTime(roundDownToDay(Date.now()))
