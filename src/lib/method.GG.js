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
		console.log(this._getGameHistory().getLast())
		if (this._getGameHistory().getLast() == 'WIN')
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
	_getGameHistory() {
		let arr = this.amounts.map((v, i) => {
			let diff = v - this.amounts[i - 1]
			if (diff == 0) return 'TIE'
			return diff > 0 ? 'WIN' : 'LOSE'
		})
		arr.getLast = function() {
			return arr[arr.length - 1]
		}
		return arr
	}
}

export default GG;