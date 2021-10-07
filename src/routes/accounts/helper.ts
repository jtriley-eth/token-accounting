import { OutputTransfer, OutputFlow } from '../../types'

const timestampToDate = (numericDate: number) => {
	return new Date(numericDate).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	})
}

export const getCsvFlowState = (flowState: OutputFlow[]): string => {
	let flowStateString =
		'date,start,end,sender,recipient,networkId,txHash,amountToken,amountFiat,exchageRate,tokenAddress'

	flowState.forEach(flow => {
		const {
			date: numericDate,
			start,
			end,
			sender,
			recipient,
			networkId,
			txHash,
			amountToken,
			amountFiat,
			exchangeRate,
			token: { underlyingAddress }
		} = flow
		const date = timestampToDate(numericDate)
		const str = `\n${date},${start},${end},${sender},${recipient},${networkId},${txHash},${amountToken},${amountFiat},${exchangeRate},${underlyingAddress}`
		flowStateString = flowStateString.concat(str)
	})

	return flowStateString
}

export const getCsvTransfers = (transfers: OutputTransfer[]): string => {
	let transfersString =
		'date,sender,recipient,networkId,txHash,amountToken,amountFiat,exchangeRate,tokenAddress'

	transfers.forEach(transfer => {
		const {
			date: numericDate,
			sender,
			recipient,
			networkId,
			txHash,
			amountToken,
			amountFiat,
			exchangeRate,
			token: { id }
		} = transfer
		const date = timestampToDate(numericDate)
		const str = `\n${date},${sender},${recipient},${networkId},${txHash},${amountToken},${amountFiat},${exchangeRate},${id}`
		transfersString = transfersString.concat(str)
	})

	return transfersString
}
