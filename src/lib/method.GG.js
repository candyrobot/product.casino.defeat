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
		// this.#splitWith2WinningStreak()
		// return this.
	}
	getBetValue() {
		if (this.amounts.#mapGameHistory(this.amounts.length - 1) == 'WIN')
			return this.#splitWith2WinningStreak().getLastArray().filter((v) => v == 'LOSE').length
		return this.betValue
	}
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
	}
	#splitWith2WinningStreak() {
		let arr = this.amounts.#mapGameHistory().toStoring().split('WIN,WIN,')
		return {
			getLastArray: ()=> arr[arr.length - 1].split(',')
		}
	}
	#mapGameHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[-i]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
	}
}

export default GG;