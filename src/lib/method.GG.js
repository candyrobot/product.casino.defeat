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
		// this._splitWith2WinningStreak()
		// return this.
	}
	getBetValue() {
		if (this._isUnusualBet())
			return this._splitWith2WinningStreak().getLastSet().filter((v) => v == 'LOSE').length
		return this.betValue
	}
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
	}
	_splitWith2WinningStreak() {
		let arr = this._getGameHistory().toString().split('WIN,WIN,')
		return {
			getLastSet: ()=> arr[arr.length - 1].split(',')
		}
	}
	_isUnusualBet() {
		let arr = this._getGameHistory()
		return arr[arr.length - 1] == 'WIN' && arr[arr.length - 2] == 'LOSE' && arr[arr.length - 3] == 'LOSE'
	}
	_getGameHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[i - 1]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
	}
}

export default GG;