class GG {
	constructor() {
		this.INITIAL_BET_VALUE = 15
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
			return this.INITIAL_BET_VALUE * this._splitWith2WinningStreak().getLastSet().filter((v) => v == 'L').length
		return this.INITIAL_BET_VALUE
	}
	putScore(income) {
		this.amount += income
		this.amounts.push(this.amount)
	}
	_splitWith2WinningStreak() {
		let str = this._getGameHistory().toString()
		console.log(str)
		let arr = str.split('W,W,')
		return {
			getLastSet: ()=> arr[arr.length - 1].split(',')
		}
	}
	_isUnusualBet() {
		let arr = this._getGameHistory()
		return arr[arr.length - 1] == 'W' && arr[arr.length - 2] == 'L' && arr[arr.length - 3] == 'L'
	}
	_getGameHistory() {
		return this.amounts.map((v, i) => {
			let diff = v - this.amounts[i - 1]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'W' : 'L'
		})
	}
}

export default GG;