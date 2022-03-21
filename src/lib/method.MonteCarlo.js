class MonteCarlo {
	constructor() {
		this.INITIAL_SCORES =  [1,2,3]
		this.scores = [...this.INITIAL_SCORES]
	}
	getBetValue() {
		return this.scores[0] + this.scores[this.scores.length - 1];
	}
	addScore() {
		this.scores.push(this.getBetValue())
	}
	removeScore() {
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