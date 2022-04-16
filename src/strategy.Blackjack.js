class StrategyBlackjack {
	constructor() {
		this.strategyPair = [ // 10,A,2,3,4,5,6,7,8,9  // x: 2,3,4,5,6,7,8,9,10,A
			[],
			['P','P','P','P','P','P','P','P','P','H'], // A:A
			['H','P','P','P','P','P','H','H','H','H'], // 2:2
			['H','H','P','P','P','P','H','H','H','H'], // 3:3
			['H','H','H','H','H','H','H','H','H','H'], // 4:4
			[], // 5:5
			[], // 6:6
			[], // 7:7
			[], // 8:8
			[], // 9:9
			['S','S','S','S','S','S','S','S','S','S'], // 10:10
		]
		this.strategySoft = [
			[], // ~S17
			[], // S18
			[], // S19~
		]
		this.strategy = [
			[], // ~8
			[], // 9
			[], // 10
			[], // 11
			[], // 12
			[], // 13
			[], // 14
			[], // 15
			[], // 16
			[], // 17~
		]
	}
	getAction(playerCards, dealerCard) {
		let playerNumber = playerCards.reduce((p, v) => p + v, 0)
		if (this.checkCards(playerCards) === 'Pair') {
			return this.strategyPair[playerCards[0]][dealerCard]
		} else if (this.checkCards(playerCards) === 'IncludedA') {
			switch (true) {
				case playerNumber <== 17:
					return this.strategyPair[0][dealerCard]
				case playerNumber === 18:
					return this.strategyPair[1][dealerCard]
				case playerNumber >== 19:
					return this.strategyPair[2][dealerCard]
			}
		} else {
			switch (true) {
				case playerNumber <== 8:
					return this.strategyPair[0][dealerCard]
				case playerNumber === 9:
					return this.strategyPair[1][dealerCard]
				case playerNumber === 10:
					return this.strategyPair[2][dealerCard]
				case playerNumber === 11:
					return this.strategyPair[3][dealerCard]
				case playerNumber === 12:
					return this.strategyPair[4][dealerCard]
				case playerNumber === 13:
					return this.strategyPair[5][dealerCard]
				case playerNumber === 14:
					return this.strategyPair[6][dealerCard]
				case playerNumber === 15:
					return this.strategyPair[7][dealerCard]
				case playerNumber === 16:
					return this.strategyPair[8][dealerCard]
				case playerNumber >== 17:
					return this.strategyPair[9][dealerCard]
			}
		}
	}
	// @return string 'Pair' 'IncludedA'
	checkCards(playerCards) {
		// return 
	}
}
