class Chibisuke {
	constructor() {
		// 資金管理をするのだからこの情報はあって当たり前:
		this.INITIAL_BET_VALUE = 1
		this.INITIAL_AMOUNT = 500
		this.betValue = this.INITIAL_BET_VALUE
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)
		// ;
		this.sideAmount = 0
		this.results = [] // [int]
	}
	getBetValue() {
		return this.betValue
	}
	getAmounts() {
		return this.amounts
	}
	getResults() {
		return this.results
	}
	setValue(value) {
		this.amount += value
		this.amounts.push(this.amount)
		this.sideAmount += value
		if (this.sideAmount < 0) {
		}
		else {
			this.sideAmount = 0
			this.betValue = this.INITIAL_BET_VALUE
		}
		if (value < 0) {
			this.betValue += this.INITIAL_BET_VALUE
		}
		this.results.push({ value, sideAmount: this.sideAmount })
	}
}

export default Chibisuke;