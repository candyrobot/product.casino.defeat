import PlayingCards from './PlayingCards'

class Baccarat {
	constructor() {
		this.playingCards = new PlayingCards(8).shuffle()
		console.log(this.playingCards)
		this.playerNum = 0
		this.bankerNum = 0
		this.usedCards = []
	}
	disCard() {
	}
	burnCard() {
	}
	dealCard() {
		let n = this.playingCards.shift()
		n = n >= 10 ? 0 : n
		this.usedCards.push(n)
		return n
	}
	playGame() {
		let playerNum = get1thDigit(this.dealCard() + this.dealCard())
		let bankerNum = get1thDigit(this.dealCard() + this.dealCard())
		if (playerNum >= 8 || bankerNum >= 8)
			return this.judge(playerNum, bankerNum)
		else if (playerNum >= 6 && bankerNum == 7)
			return this.judge(playerNum, bankerNum)
		else if (playerNum <= 5) {
			dealtNum = this.dealCard()
			playerNum = get1thDigit(playerNum + dealtNum)
			if (
				bankerNum <= 2 ||
				bankerNum == 3 && [1,2,3,4,5,6,7,9,0].find((n) => n == dealtNum) ||
				bankerNum == 4 && [2,3,4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 5 && [4,5,6,7].find((n) => n == dealtNum) ||
				bankerNum == 6 && [6,7].find((n) => n == dealtNum)
			)
				bankerNum = get1thDigit(bankerNum + this.dealCard())
			else
				console.warn('例外発生')
			return this.judge(playerNum, bankerNum)
		}
		

		// if (this.playerNum == 9) {
		// 	if (this.bankerNum == 9)
		// 		return 'TIE'
		// 	else
		// 		return 'P'
		// }
		// else if (this.playerNum == 8) {
		// 	if (this.bankerNum == 9)
		// 		return 'B'
		// 	else if (this.bankerNum == 8)
		// 		return 'TIE'
		// 	else
		// 		return 'P'
		// }
		// else if (this.playerNum == 7) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8) 
		// 		return 'B'
		// 	else if (this.bankerNum == 7)
		// 		return 'TIE'
		// 	else if (this.bankerNum == 6)
		// 		return 'P'
		// }
		// else if (this.playerNum == 6) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8 || this.bankerNum == 7) 
		// 		return 'B'
		// 	else if (this.bankerNum == 6)
		// 		return 'TIE'
		// 	else if (this.bankerNum == 5)
		// 		return 'P'
		// }
		// else if (this.playerNum == 5) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8 || this.bankerNum == 7 || this.bankerNum == 6) 
		// 		return 'B'
		// 	else if (this.bankerNum == 5)
		// 		return 'TIE'
		// 	dealtNum = this.dealCard()
		// 	this.playerNum = get1thDigit(this.playerNum + dealtNum)
		// 	if (this.bankerNum == 3 && [1,2,3,4,5,6,7,9,0].find((n) => n == dealtNum)) {
		// 		this.bankerNum = get1thDigit(this.bankerNum + this.dealCard())
		// 		if (this.playerNum == this.bankerNum)
		// 			return 'TIE'
		// 		else
		// 			return this.playerNum > this.bankerNum ? 'P' : 'B'
		// 	}
		// }
		// else if (this.playerNum == 4) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8 || this.bankerNum == 7 || this.bankerNum == 6) 
		// 		return 'B'
		// 	else if (this.bankerNum == 4)
		// 		return 'TIE'
		// 	dealtNum = this.dealCard()
		// 	this.playerNum = get1thDigit(this.playerNum + dealtNum)
		// 	if (this.bankerNum == 4 && [2,3,4,5,6,7].find((n) => n == dealtNum)) {
		// 		this.bankerNum = get1thDigit(this.bankerNum + this.dealCard())
		// 		if (this.playerNum == this.bankerNum)
		// 			return 'TIE'
		// 		else
		// 			return this.playerNum > this.bankerNum ? 'P' : 'B'
		// 	}
		// }
		// else if (this.playerNum == 3) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8 || this.bankerNum == 7 || this.bankerNum == 6) 
		// 		return 'B'
		// 	else if (this.bankerNum == 3)
		// 		return 'TIE'
		// 	dealtNum = this.dealCard()
		// 	this.playerNum = get1thDigit(this.playerNum + dealtNum)
		// 	if (this.bankerNum == 5 && [4,5,6,7].find((n) => n == dealtNum)) {
		// 		this.bankerNum = get1thDigit(this.bankerNum + this.dealCard())
		// 		if (this.playerNum == this.bankerNum)
		// 			return 'TIE'
		// 		else
		// 			return this.playerNum > this.bankerNum ? 'P' : 'B'
		// 	}
		// }
		// else if (this.playerNum == 2) {
		// 	if (this.bankerNum == 9 || this.bankerNum == 8 || this.bankerNum == 7 || this.bankerNum == 6) 
		// 		return 'B'
		// 	else if (this.bankerNum == 2)
		// 		return 'TIE'
		// 	dealtNum = this.dealCard()
		// 	this.playerNum = get1thDigit(this.playerNum + dealtNum)
		// 	if (this.bankerNum == 6 && [6,7].find((n) => n == dealtNum)) {
		// 		this.bankerNum = get1thDigit(this.bankerNum + this.dealCard())
		// 		if (this.playerNum == this.bankerNum)
		// 			return 'TIE'
		// 		else
		// 			return this.playerNum > this.bankerNum ? 'P' : 'B'
		// 	}
		// }

	}
	judge(playerNum, bankerNum) {
		if (playerNum == bankerNum)
			return 'TIE'
		else
			return playerNum > bankerNum ? 'PLAYER' : 'BANKER'
	}

}


// TODO: Number.js で拡張すべし
function get1thDigit(n) {
	return Math.floor(n / 1) % 10 // 一桁めをとる
	// Math.floor(n / 10) % 10 // 二桁めをとる
}

export default Baccarat;