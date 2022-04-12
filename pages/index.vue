<template>
  <div class="text-base text-slate-500">
    <MathHeader
      :rankMapping="rankMapping"
      :star="getInitStats.star"
      :attempts="getAttemptRemaining"
    />
    <main class="px-2 flex flex-col">
      <div v-if="isEmptyAttempts" class="h-full py-2 text-center">
        <p class="text-slate-500 text-base font-bold uppercase">Try again in next :</p>
        <p class="text-sky-600 text-2xl font-black mb-4">{{ getTimeToNextPlay }}</p>
        <p class="text-slate-500 text-base font-bold uppercase">Statistic :</p>
        <div class="border-2 border-slate-100 p-4 mt-2 text-left mb-4">
          <div class="flex flex-row justify-center mb-2">
            <div class="flex flex-col">
              <span :class="`border-2 ${getRankClass(getAllStats.highestRank).css} px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase text-center`">{{ getRankClass(getAllStats.highestRank).text }}</span>
              Highest Rank
            </div>
          </div>
          <div class="flex flex-row mb-2">
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">{{ getAllStats.fastestTime.toFixed(2) }}s</p>
              Fastest Time
            </div>
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">{{ getAllStats.longestTime.toFixed(2) }}s</p>
              Longest Time
            </div>
          </div>
          <div class="flex flex-row mb-4">
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">{{ getAllStats.totalWin }}</p>
              Total Win
            </div>
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">{{ getAllStats.totalLose }}</p>
              Total Lose
            </div>
          </div>
          <div class="flex flex-row justify-center">
            <div class="flex flex-col text-center">
              <div class="flex flex-row justify-center mb-2">
                <div v-for="(form,index) in getAllStats.form" :key="index">
                  <span :class="`text-center font-bold p-2 text-xs mx-1 uppercase ${getTextClassForm(form).class}`">{{ getTextClassForm(form).text }}</span>
                </div>
              </div>
              Current Form
            </div>
          </div>
        </div>
        <p class="text-slate-500 text-base font-bold uppercase">Latest Result :</p>
        <div class="border-2 border-slate-100 p-2 mt-2 text-left flex flex-row justify-center items-center" v-for="(rslt, index) in getLatestResult" :key="index">
          <div class="flex flex-col w-2/4 text-center">
            <p class="text-sky-600 text-xl font-bold">{{ rslt.score }}/5</p>
            Score
          </div>
          <div class="flex flex-row justify-center mx-2">
            <div v-for="(round, index) in rslt.round" :key="index" :class="`${round ? 'bg-emerald-600' : 'bg-rose-600'} w-7 text-center text-xs uppercase font-bold p-2 mr-1 uppercase text-white`">
              {{ round ? 'W' : 'L' }}
            </div>
          </div>
          <div class="flex flex-col w-2/4 text-center">
            <p class="text-sky-600 text-xl font-bold">{{ rslt.averageTime.toFixed(2) }}s</p>
            Average Time
          </div>
        </div>
        <button class="mt-2 w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="shareIt">Copy to Clipboard</button>
      </div>
      <div v-else-if="isEnded" class="h-full flex-col flex justify-between text-center py-2">
        <div>
          <p class="text-slate-500 text-base font-bold uppercase">Result :</p>
          <div v-for="(rslt, index) in result" :key="`hasil-${index}`" class="border-2 border-slate-100 p-2 mt-2 text-left">
            <p :class="`mx-1 text-sm w-10 h-10 inline-flex items-center justify-center uppercase text-slate-100 font-black ${rslt.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'}`">{{ rslt.isCorrect ? 'W' : 'L' }}</p>
            <p class="text-sm inline mx-1">Q : {{ rslt.question }}</p>
            <p class="text-sm inline mx-1 text-emerald-600">A : {{ rslt.answer }}</p>
            <p class="text-sm inline mx-1 text-sky-600">mA : {{ rslt.myAnswer }}</p>
            <p class="text-sm inline">{{ rslt.timeSpent / 1000 }}s</p>
          </div>
          <div class="mb-4 text-center">
            <div class="text-5xl mb-2 mt-4" v-html="getEmotScore"></div>
            <div class="text-base">Average Time : {{ getAvgTime }}s</div>
          </div>
        </div>
        <div>
        <!-- <p class="block text-3xl text-sky-600 text-center font-black mb-4 uppercase">{{ getFeedbackMsg }}</p> -->
        <template v-if="isHighestRank">
          <button v-if="isEligibleStarDown" @click="goPrevRankStar" class="w-full bg-rose-600 hover:bg-rose-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Prev Rank</button>
          <button v-else @click="retry" class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Try Again</button>
        </template>
        <template v-else-if="isLowestRank">
          <button v-if="isEligibleStarUp" @click="goNextRankStar" class="w-full bg-emerald-600 hover:bg-emerald-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Next Rank</button>
          <button v-else @click="retry" class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Try Again</button>
        </template>
        <template v-else>
          <button v-if="isEligibleStarUp" @click="goNextRankStar" class="w-full bg-emerald-600 hover:bg-emerald-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Next Rank</button>
          <button v-else-if="isEligibleStarDown" @click="goPrevRankStar" class="w-full bg-rose-600 hover:bg-rose-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Prev Rank</button>
          <button @click="retry" v-else class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">Try Again</button>
        </template>
        </div>
      </div>
      <div v-else-if="isStarted" class="h-full py-2">
        <div v-for="(qst, index) in questions" :key="`pertanyaan-${index}`" :class="`${index === currentQuestion ? 'h-full' : 'h-0'}`">
          <div v-if="index === currentQuestion" class="flex flex-col h-full justify-center text-center">
            <div class="text-slate-300 text-base text-medium mb-4"> Question {{ index + 1 }}</div>
            <div :class="`text-sky-600 ${getQuestionClass} font-black mb-4`">{{ qst.question }}</div>
            <input type="number" v-model="currentAnswer" :ref="`input-${index}`" class="mb-2 p-2 border-2 border-slate-200 rounded focus:border-sky-300 focus:outline-none hover:border-sky-300 transition ease-in-out duration-300">
            <button @click="confirmAnswer(qst, index)" class="bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase">confirm</button>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col justify-center content-center h-full py-2">
        <MathRules/>
        <button class="bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium" @click="startMath">Show Me the Math!</button>
      </div>
    </main>
  </div>
</template>
<script>
import mathQuestion from '@/models/math-game'
import MathHeader from '@/components/MathHeader.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'IndexPage',
  components: {
    MathHeader,
  },
  data: () => ({
    questions: [],
    currentAnswer: '',
    currentQuestion: 0,
    totalQuestion: 5,
    currentTimeStart: 0,
    result: [],
    isStarted: false,
    baseTime: 3,
  }),
  computed: {
    ...mapGetters([
      'isEligibleToPlay',
      'getInitStats',
      'getAttemptRemaining',
      'isEmptyAttempts',
      'getAllStore',
      'getTimeToNextPlay',
      'getAllStats',
      'getLatestResult',
    ]),
    getQuestionClass() {
      return ['-', 'text-8xl', 'text-7xl','text-6xl','text-5xl','text-4xl'][this.getInitStats.rank];
    },
    getEmotScore() {
      let score = '';
      this.result.forEach(x => {
        x.isCorrect ? score = score + '&#128526;' : score = score + '&#128557;'
      })
      return score;
    },
    getScore() {
      let score = 0;
      this.result.forEach(x => {
        if (x.isCorrect) score++
      })
      return score;
    },
    rankMapping() {
      return ['-','bronze', 'silver','gold', 'diamond', 'goat'][this.getInitStats.rank];
    },
    getAvgTime() {
      return (this.result.map(x => x.timeSpent).reduce((x, y) => x + y, 0))/5000;
    },
    isEnded() {
      return this.result.length === 5;
    },
    isEligibleStarUp() {
      return this.isEnded && this.getScore === 5 && this.getAvgTime <= this.baseTime + this.getInitStats.rank;
    },
    isEligibleStarDown() {
      return this.isEnded && (this.getScore <= 2 || this.getAvgTime >= 2*this.baseTime + this.getInitStats.rank);
    },
    isHighestRank() {
      return this.getInitStats.rank === 5 && this.getInitStats.star === 5;
    },
    isLowestRank() {
      return this.getInitStats.rank === 1 && this.getInitStats.star === 1;
    },
  },
  async mounted() {
    // init forage for 1st time play
    const getForage = await this.$localForage.getItem('mathfive');
    if (!!getForage) {
      console.log(getForage)
      await this.$nextTick();
      await this.setStore(getForage); // hydrate store from forage
      
    } else {
      await this.$localForage.setItem('mathfive', this.getAllStore); // if no forage, set forage from default store
    }
    if (this.isEligibleToPlay) {
      if (this.getAttemptRemaining === 0) this.setRemainingAttempt(5);
    } else {
      // show latest result & time for next play
    }
  },
  methods: {
    ...mapMutations([
      'setRemainingAttempt',
      'addHistory',
      'reduceAttemptRemaining',
      'nextRankStar',
      'prevRankStar',
      'setLatestAttemptDate',
      'setStore',
    ]),
    ...mapActions([
      'saveResult',
    ]),
    getTextClassForm(form) {
      let formIcon = { text: '-', class: 'bg-slate-300', icon: '⚪'};
      if (form === 1) {
        formIcon = { text: 'W', class: 'bg-emerald-600 text-white', icon: '🟢'};
      } else if (form === -1) {
        formIcon = { text: 'L', class: 'bg-rose-600 text-white', icon: '🔴'};
      }
      return formIcon;
    },
    getRankClass(rank) {
      const text = ['-','bronze', 'silver','gold', 'diamond', 'goat'];
      const css = ['-', 'border-amber-600 bg-amber-600','border-slate-400 bg-slate-400','border-amber-300 bg-amber-300','border-fuchsia-800 bg-fuchsia-800','border-rose-700 bg-rose-700'];
      return {
        text: text[rank],
        css: css[rank]
      };
    },
    startMath() {
      this.isStarted = true;
      this.init();
    },
    async init() {
      const x = new mathQuestion(this.getInitStats.rank, this.getInitStats.star, 5);
      this.questions = x.makeQuestion();
      this.currentTimeStart = new Date().getTime();
      this.result = [];
      this.currentQuestion = 0;
      await this.$nextTick();
      if (!!this.$refs['input-0'][0]) this.$refs['input-0'][0].focus();
    },
    async confirmAnswer(qst) {
      if (!this.currentAnswer.length) return;
      const timeEnd = new Date().getTime();
      this.result.push({
        ...qst,
        myAnswer: Number(this.currentAnswer),
        isCorrect: qst.answer === Number(this.currentAnswer),
        timeSpent: timeEnd - this.currentTimeStart,
      })
      this.currentAnswer = '';
      this.currentTimeStart = timeEnd;
      if (this.currentQuestion < 4) this.currentQuestion++;
      await this.$nextTick();
      if (!!this.$refs[`input-${this.currentQuestion}`][0]) this.$refs[`input-${this.currentQuestion}`][0].focus();
    },
    // handle attempt calculation and end of game if user has no attempt left
    async handleAttempts() {
      this.reduceAttemptRemaining();
      // user still has attempt
      if (this.getAttemptRemaining > 0) { 
        this.setForage();
        this.init();
      } else {
        // to handle next game time for user
        this.setLatestAttemptDate(new Date().getTime());
        this.setForage();
      }
    },
    async goNextRankStar() {
      // save result and insert to stat related store
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime});
      // set next rank star in store
      this.nextRankStar();
      // update localForage
      this.setForage();
      this.init();
    },
    goPrevRankStar() {
      // save result and insert to stat related store
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime});
      // set prev rank star in store
      this.prevRankStar();
      this.handleAttempts();
    },
    retry() {
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime});
      this.handleAttempts();
    },
    // update localForage
    async setForage() {
      await this.$localForage.setItem('mathfive', this.getAllStore);
    },
    shareIt() {
      let star = '';
      for(let i = 0; i < this.getInitStats.star; i++) star = star + '⭐';
      let form = '';
      this.getAllStats.form.forEach(x => {
        form = form + this.getTextClassForm(x).icon;
      })
      const text = `i'm ${this.rankMapping} ${star} - ${form} - https://math-five-apps.vercel.app/`;
      if (window.clipboardData && window.clipboardData.setData) {
        window.clipboardData.setData('Text', text);
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
        } catch (error) {
          console.error('Copy to clipboard failed.', error);
        } finally {
          document.body.removeChild(textarea);
        }
      }
    }
  }
}
</script>
<style scoped>
main {
  margin-top: 86px;
  overflow: auto;
  height: calc(100vh - 86px);
}
</style>