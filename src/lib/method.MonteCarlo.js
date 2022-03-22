class MonteCarlo {
	constructor() {
		this.INITIAL_AMOUNT = 500
		this.amount = this.INITIAL_AMOUNT
		this.amounts = [] // [int]
		this.amounts.push(this.INITIAL_AMOUNT)

		this.INITIAL_SCORES =  [1,2,3]
		this.scores = [...this.INITIAL_SCORES]
	}
	getBetValue() {
		return this.scores[0] + this.scores[this.scores.length - 1];
	}
	addScore() {
		this.amounts.push(this.amount)
		
		this.scores.push(this.getBetValue())
	}
	removeScore() {
		this.amounts.push(this.amount)
		
		this.scores.pop();
		this.scores.shift();
		if (this.scores.length < 2) {
			this.reset()
		}
	}
	reset() {
		this.scores = [...this.INITIAL_SCORES]
	}
}

export default MonteCarlo;