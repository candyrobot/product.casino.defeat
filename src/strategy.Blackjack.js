class StrategyBlackjack {
	constructor() {
		this.strategyPair = {
			4: { 2:'H',3:'P',4:'P',5:'P',6:'P',7:'P',8:'H',9:'H',10:'H',1:'H' }, // 2:2
			6: { 2:'H',3:'H',4:'P',5:'P',6:'P',7:'P',8:'H',9:'H',10:'H',1:'H' }, // 3:3
			8: { 2:'H',3:'H',4:'H',5:'H',6:'H',7:'H',8:'H',9:'H',10:'H',1:'H' }, // 4:4
			10: { 2:'D',3:'D',4:'D',5:'D',6:'D',7:'D',8:'D',9:'D',10:'H',1:'H' }, // 5:5
			12: { 2:'P',3:'P',4:'P',5:'P',6:'P',7:'H',8:'H',9:'H',10:'H',1:'H' }, // 6:6
			14: { 2:'P',3:'P',4:'P',5:'P',6:'P',7:'P',8:'H',9:'H',10:'S',1:'H' }, // 7:7
			16: { 2:'P',3:'P',4:'P',5:'P',6:'P',7:'P',8:'P',9:'P',10:'H',1:'H' }, // 8:8
			18: { 2:'P',3:'P',4:'P',5:'P',6:'P',7:'S',8:'P',9:'P',10:'S',1:'S' }, // 9:9
			20: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'S',8:'S',9:'S',10:'S',1:'S' }, // 10:10
			2: { 2:'P',3:'P',4:'P',5:'P',6:'P',7:'P',8:'P',9:'P',10:'P',1:'H' }, // A:A
		}
		// WARN: PlayerCards内の1を11として使ってください
		this.strategySoft = {
			17: { 2:'H',3:'H',4:'H',5:'H',6:'H',7:'H',8:'H',9:'H',10:'H',1:'H' }, // ~S17
			18: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'S',8:'S',9:'H',10:'H',1:'S' }, // S18
			19: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'S',8:'S',9:'S',10:'S',1:'S' }, // S19~
		}
		this.strategy = {
			8: { 2:'H',3:'H',4:'H',5:'H',6:'H',7:'H',8:'H',9:'H',10:'H',1:'H' },
			9: { 2:'D',3:'D',4:'D',5:'D',6:'D',7:'H',8:'H',9:'H',10:'H',1:'H' },
			10: { 2:'D',3:'D',4:'D',5:'D',6:'D',7:'D',8:'D',9:'D',10:'H',1:'H' },
			11: { 2:'D',3:'D',4:'D',5:'D',6:'D',7:'D',8:'D',9:'D',10:'H',1:'H' },
			12: { 2:'H',3:'H',4:'S',5:'S',6:'S',7:'H',8:'H',9:'H',10:'H',1:'H' },
			13: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'H',8:'H',9:'H',10:'H',1:'H' },
			14: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'H',8:'H',9:'H',10:'H',1:'H' },
			15: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'H',8:'H',9:'H',10:'H',1:'H' },
			16: { 2:'S',3:'S',4:'S',5:'S',6:'S',7:'H',8:'H',9:'H',10:'H',1:'H' },
			17: { 2:'H',3:'H',4:'H',5:'H',6:'H',7:'H',8:'H',9:'H',10:'H',1:'H' },
		}
	}
	/**
	 * @return {string} 'H' 'S' 'P'
	 */
	getAction(playerCards, dealerCard) {
		let sum = playerCards.reduce((p, v) => p + v, 0)
		if (this.checkCards(playerCards) === 'Pair')
			return this.strategyPair[sum][dealerCard]
		else if (this.checkCards(playerCards) === 'IncludedA') {
			// INFO: strategySoftは1を11と扱うので+10しておく
			sum = sum += 10
			sum = sum <== 17 ? 17 : sum
			sum = sum >== 19 ? 19 : sum
			return this.strategySoft[sum][dealerCard]
		} else {
			sum = sum <== 8 ? 8 : sum
			sum = sum >== 17 ? 17 : sum
			return this.strategy[sum][dealerCard]
		}
	}
	/**
	 * @return {string} 'Pair' 'IncludedA'
	 */
	checkCards(playerCards) {
		if (playerCards.length === 2 && playerCards[0] === playerCards[1])
			return 'Pair'
		else if (playerCards.find((v) => v === 1))
			return 'IncludedA'
	}
}

dependsOnA() {
	return 'D'
}