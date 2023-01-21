import { evaluate } from 'mathjs'

class MathQuestion {
  constructor (rank = 1, star = 1, totalQuestion = 5) {
    this.rank = rank //
    this.star = star // 1 - 5
    this.questions = this.makeQuestion()
    this.totalQuestion = totalQuestion
  }

  getQuestion () {
    return this.questions
  }

  getRank () {
    return this.rank
  }

  getStar () {
    return this.star
  }

  getTotalQuestion () {
    return this.totalQuestion
  }

  getRandomInt (max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  getRandomOperator () {
    const operatorPlusMinus = ['+', '-']
    const operatorPlusMinusMultiplication = ['+', '-', '*']
    if ([1, 2].includes(this.star)) {
      return '+'
    } else if ([3, 4].includes(this.star)) {
      return operatorPlusMinus[this.getRandomInt(2)]
    }
    return operatorPlusMinusMultiplication[this.getRandomInt(3)]
  }

  makeQuestion () {
    const questions = []
    for (let q = 0; q <= this.totalQuestion - 1; q++) {
      let question = ''
      for (let r = 0; r <= this.rank; r++) {
        if (r !== 0) { question = question + this.getRandomOperator() }
        question = question + this.getRandomInt(10, 1)
      };
      questions[q] = {
        question,
        answer: Math.floor(evaluate(question))
      }
    }

    return questions
  }
}

export default MathQuestion
