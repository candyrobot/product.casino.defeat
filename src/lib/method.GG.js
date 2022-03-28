class GG {
	constructor() {
		this.INITIAL_BET_VALUE = 1
		this.betValue = this.INITIAL_BET_VALUE
		this.INITIAL_AMOUNT = 500
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)
	}
	getBetPosition() {
		// this.splitWith2WinningStreak()
		// return this.
	}
	getBetValue() {
		return this.betValue
	}
	getHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[-i]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
	}
	getLoseCount(array) {
		this.array.filter((v) => v == 'LOSE').length
	}
	splitWith2WinningStreak() {
		let arr = this.amounts.getHistory().toStoring().split('WIN,WIN,')
		return arr[arr.length - 1].split(',')
	}
}

export default GG;