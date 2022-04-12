import { evaluate } from 'mathjs'

class mathQuestion {
  constructor(rank=1, star=1, totalQuestion=5) {
    this.rank = rank; // 
    this.star = star; // 1 - 5
    this.questions = this.makeQuestion();
    this.totalQuestion = totalQuestion;
  }

  getQuestion() {
    return this.questions;
  }

  getRank() {
    return this.rank;
  }

  getStar() {
    return this.star;
  }

  getTotalQuestion() {
    return this.totalQuestion;
  }

  getRandomInt(max, min=0) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getRandomOperator() {
    const operatorPlusMinus = ['+','-'];
    const operatorPlusMinusMultiplication = ['+', '-', '*'];
    const operatorFull = ['+', '-', '*', '/'];
    if (this.star == 1) {
      return '+';
    } else if (this.star === 2) {
      return operatorPlusMinus[this.getRandomInt(2)];
    } else if (this.star === 3 || this.star === 4) {
      return operatorPlusMinusMultiplication[this.getRandomInt(3)];
    } 
    return operatorFull[this.getRandomInt(4)];
  }

  makeQuestion() {
    const qst = [];
    for(let q = 0; q <= this.totalQuestion - 1; q++) {
      let question = '';
      for(let r = 0; r <= this.rank; r++) {
        if (r != 0) question = question + this.getRandomOperator();
        question = question + this.getRandomInt(10, 1);
      };
      qst[q] = {
        question,
        answer: Math.floor(evaluate(question)),
      };
      console.log(Math.floor(evaluate(question)))
    }

    

    return qst;
  } 
}

export default mathQuestion;