<template>
  <div class="text-base text-slate-500">
    <MathHeader
      :rank-mapping="rankMapping"
      :star="getInitStats.star"
      :attempts="getAttemptRemaining"
    />
    <main class="px-2 flex flex-col">
      <div v-if="isEmptyAttempts" class="h-full py-2 text-center">
        <p class="text-slate-500 text-base font-bold uppercase">
          Coba lagi dalam waktu :
        </p>
        <p class="text-sky-600 text-2xl font-black mb-4">
          {{ getTimeToNextPlay }}
        </p>
        <p class="text-slate-500 text-base font-bold uppercase">
          Statistic :
        </p>
        <div class="border-2 border-slate-100 p-4 mt-2 text-left mb-4">
          <div class="flex flex-row justify-center mb-2">
            <div class="flex flex-col items-center">
              <span :class="`border-2 ${getRankClass(getAllStats.highestRank).css} px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase text-center`">{{ getRankClass(getAllStats.highestRank).text }}</span>
              <div
                class="flex flex-row justify-center items-center gap-0.5 mt-1"
                role="img"
                :aria-label="`${getHighestStarDisplay} bintang`"
              >
                <svg
                  v-for="n in getHighestStarDisplay"
                  :key="`highest-star-${n}`"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="`h-5 w-5 ${getHighestRankStarClass} inline`"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-xs text-slate-400 uppercase mt-0.5">Rank Tertinggi</span>
            </div>
          </div>
          <div class="flex flex-row mb-2">
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">
                {{ getAllStats.fastestTime.toFixed(2) }}s
              </p>
              Waktu Tercepat
            </div>
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">
                {{ getAllStats.longestTime.toFixed(2) }}s
              </p>
              Waktu Terlama
            </div>
          </div>
          <div class="flex flex-row mb-4">
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">
                {{ getAllStats.totalWin }}
              </p>
              Total Jawaban Benar
            </div>
            <div class="flex flex-col w-2/4 text-center">
              <p class="text-sky-600 text-xl font-bold">
                {{ getAllStats.totalLose }}
              </p>
              Total Jawaban Salah
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
        <p class="text-slate-500 text-base font-bold uppercase">
          Hasil Terkini :
        </p>
        <div v-for="(rslt, idx) in getLatestResult" :key="idx" class="border-2 border-slate-100 p-3 mt-2 text-left">
          <div class="flex flex-row flex-wrap justify-center items-center gap-2 mb-3">
            <div class="flex flex-col text-center min-w-[4.5rem]">
              <p class="text-sky-600 text-xl font-bold">
                {{ rslt.score }}/5
              </p>
              <span class="text-xs text-slate-400">Skor</span>
            </div>
            <div class="flex flex-row justify-center flex-wrap gap-1">
              <div
                v-for="(round, rIdx) in rslt.round"
                :key="rIdx"
                :class="`${round ? 'bg-emerald-600' : 'bg-rose-600'} w-7 text-center text-xs uppercase font-bold p-2 text-white`"
              >
                {{ round ? 'W' : 'L' }}
              </div>
            </div>
            <div class="flex flex-col text-center min-w-[5rem]">
              <p class="text-sky-600 text-xl font-bold">
                {{ rslt.averageTime.toFixed(2) }}s
              </p>
              <span class="text-xs text-slate-400">Rata-rata</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex justify-center">
              <span :class="`inline-block border-2 px-3 py-1 rounded-2xl text-xs font-bold uppercase text-white ${getLatestOutcomeClass(rslt)}`">
                {{ getLatestOutcomeLabel(rslt) }}
              </span>
            </div>
            <p v-if="getLatestReasonLines(rslt).length" class="text-sm text-slate-600 list-disc list-inside space-y-1">
              <span v-for="(line, lineIdx) in getLatestReasonLines(rslt)" :key="lineIdx">
                {{ line }}
              </span>
            </p>
            <p v-else class="text-center text-xs text-slate-400 italic">
              Riwayat lama — detail alasan tidak tersimpan.
            </p>
          </div>
        </div>
        <div class="w-full h-20" />
        <div class="fixed bottom-2 left-2 right-2 flex flex-col gap-2">
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 bg-violet-600 hover:bg-violet-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-sm font-semibold uppercase"
              @click="shareCopyImage"
            >
              Salin gambar
            </button>
            <button
              type="button"
              class="flex-1 bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-sm font-semibold uppercase"
              @click="shareCopyText"
            >
              Teks + link
            </button>
          </div>
          <p class="text-center text-xs text-slate-400 px-1">
            Gambar untuk tempel visual; teks berisi link untuk keterangan / bio.
          </p>
        </div>
      </div>
      <div v-else-if="isEnded" class="h-full flex-col flex justify-between text-center py-2">
        <div>
          <p class="text-slate-500 text-base font-bold uppercase">
            Hasil :
          </p>
          <div v-for="(rslt, index) in result" :key="`hasil-${index}`" class="border-2 border-slate-100 p-2 mt-2 text-left">
            <p :class="`mx-1 text-sm w-10 h-10 inline-flex items-center justify-center uppercase text-slate-100 font-black ${rslt.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'}`">
              {{ rslt.isCorrect ? 'W' : 'L' }}
            </p>
            <p class="text-sm inline mx-1">
              Tanya : {{ rslt.question }}
            </p>
            <p class="text-sm inline mx-1 text-emerald-600">
              Kunci : {{ rslt.answer }}
            </p>
            <p class="text-sm inline mx-1 text-sky-600">
              Jawabanmu : {{ rslt.myAnswer }}
            </p>
            <p class="text-sm inline">
              {{ rslt.timeSpent / 1000 }}s
            </p>
          </div>
          <div class="mb-4 text-center">
            <div class="text-5xl mb-2 mt-4" v-html="getEmotScore" />
            <div class="text-base">
              Waktu Rata - rata : {{ getAvgTime }}s
            </div>
          </div>
        </div>
        <div>
          <template v-if="isHighestRank">
            <button v-if="isEligibleStarDown" class="w-full bg-rose-600 hover:bg-rose-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="goPrevRankStar">
              Turun Rank
            </button>
            <button v-else class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="retry">
              Coba Lagi
            </button>
          </template>
          <template v-else-if="isLowestRank">
            <button v-if="isEligibleStarUp" class="w-full bg-emerald-600 hover:bg-emerald-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="goNextRankStar">
              Naik Rank
            </button>
            <button v-else class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="retry">
              Coba Lagi
            </button>
          </template>
          <template v-else>
            <button v-if="isEligibleStarUp" class="w-full bg-emerald-600 hover:bg-emerald-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="goNextRankStar">
              Naik Rank
            </button>
            <button v-else-if="isEligibleStarDown" class="w-full bg-rose-600 hover:bg-rose-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="goPrevRankStar">
              Turun Rank
            </button>
            <button v-else class="w-full bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium uppercase" @click="retry">
              Coba Lagi
            </button>
          </template>
        </div>
      </div>
      <div v-else-if="isStarted" class="h-full py-2 ">
        <div v-for="(qst, index) in questions" :key="`pertanyaan-${index}`" :class="`${index === currentQuestion ? 'h-full' : 'h-0'}`">
          <div v-if="index === currentQuestion" class="flex flex-col h-full justify-center text-center">
            <div class="text-slate-300 text-base text-medium mb-1">
              Pertanyaan no {{ index + 1 }}
            </div>
            <!-- <div class="text-slate-300 text-base text-medium mb-4">
              Sisa Waktu <span class="text-amber-600 text-medium">{{ countdownTimer }}</span> detik
            </div> -->
            <div :class="`text-sky-600 ${getQuestionClass} font-black mb-4`">
              {{ qst.question }}
            </div>
            <div class="flex flex-col gap-5 text-left w-full mx-auto">
              <label
                v-for="(opt, optIdx) in qst.choices"
                :key="`${index}-${optIdx}-${opt}`"
                class="flex items-center gap-3 py-5 px-2 border-2 border-slate-200 rounded cursor-pointer hover:border-sky-300 transition ease-in-out duration-300 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50"
              >
                <input
                  type="radio"
                  class="h-4 w-4 text-sky-600 focus:ring-sky-500"
                  :name="`answer-${index}`"
                  :value="opt"
                  @change="confirmAnswer(qst, opt)"
                >
                <span class="text-sky-700 font-semibold text-xl">{{ opt }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col justify-center content-center h-full py-2">
        <MathRules :is-read-rules="getConfig.isReadRules" @closeRules="closeRules" />
        <button class="bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-base font-medium" @click="startMath">
          Show Me the Math!
        </button>
        <p class="text-center text-base text-stale-300 mt-2">
          made by <a href="https://twitter.com/agungdlgs" class="underline text-sky-600 text-base font-bold" target="_blank">@agungdlgs</a>
        </p>
      </div>
    </main>
    <div v-show="snackbarToggle" class="fixed top-2 left-2 right-2 px-2 py-1 bg-slate-600 text-white text-center text-base rounded capitalize">
      {{ snackbar }}
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import MathQuestion from '@/models/math-game'
import MathHeader from '@/components/MathHeader.vue'

const SHARE_SITE_PATH = '/'

export default {
  name: 'IndexPage',
  components: {
    MathHeader
  },
  data: () => ({
    questions: [],
    currentQuestion: 0,
    totalQuestion: 5,
    currentTimeStart: 0,
    result: [],
    isStarted: false,
    baseTime: 3,
    countdownTimer: 0,
    snackbar: '',
    snackbarToggle: false
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
      'getConfig'
    ]),
    getQuestionClass () {
      return ['-', 'text-8xl', 'text-7xl', 'text-6xl', 'text-5xl', 'text-4xl'][this.getInitStats.rank]
    },
    getEmotScore () {
      let score = ''
      this.result.forEach((x) => {
        x.isCorrect ? score = score + '&#128526;' : score = score + '&#128557;'
      })
      return score
    },
    getScore () {
      let score = 0
      this.result.forEach((x) => {
        if (x.isCorrect) { score++ }
      })
      return score
    },
    rankMapping () {
      return ['-', 'bronze', 'silver', 'gold', 'diamond', 'goat'][this.getInitStats.rank]
    },
    getHighestStarDisplay () {
      const s = this.getAllStats.highestStar
      return s != null ? s : 1
    },
    getHighestRankStarClass () {
      const map = {
        1: 'text-amber-600',
        2: 'text-slate-400',
        3: 'text-amber-300',
        4: 'text-fuchsia-800',
        5: 'text-rose-700'
      }
      return map[this.getAllStats.highestRank] || 'text-slate-400'
    },
    getAvgTime () {
      return (this.result.map(x => x.timeSpent).reduce((x, y) => x + y, 0)) / 5000
    },
    getCurrentTimeLimit () {
      return this.baseTime + this.getInitStats.rank
    },
    isEnded () {
      return this.result.length === 5
    },
    isEligibleStarUp () {
      return this.isEnded && this.getScore === 5 && this.getAvgTime <= this.baseTime + this.getInitStats.rank
    },
    isEligibleStarDown () {
      return this.isEnded && (this.getScore <= 2 || this.getAvgTime >= 2 * this.baseTime + this.getInitStats.rank)
    },
    isHighestRank () {
      return this.getInitStats.rank === 5 && this.getInitStats.star === 5
    },
    isLowestRank () {
      return this.getInitStats.rank === 1 && this.getInitStats.star === 1
    }
  },
  async mounted () {
    // init forage for 1st time play
    const getForage = await this.$localForage.getItem('mathfive')
    if (getForage) {
      await this.$nextTick()
      await this.setStore(getForage) // hydrate store from forage
    } else {
      await this.$localForage.setItem('mathfive', this.getAllStore) // if no forage, set forage from default store
    }
    if (this.isEligibleToPlay) {
      if (this.getAttemptRemaining === 0) { this.setRemainingAttempt(5) }
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
      'setStore'
    ]),
    ...mapActions([
      'saveResult',
      'saveConfig'
    ]),
    getTextClassForm (form) {
      let formIcon = { text: '-', class: 'bg-slate-300', icon: '⚪' }
      if (form === 1) {
        formIcon = { text: 'W', class: 'bg-emerald-600 text-white', icon: '🟢' }
      } else if (form === -1) {
        formIcon = { text: 'L', class: 'bg-rose-600 text-white', icon: '🔴' }
      }
      return formIcon
    },
    getRankClass (rank) {
      const text = ['-', 'bronze', 'silver', 'gold', 'diamond', 'goat']
      const css = ['-', 'border-amber-600 bg-amber-600', 'border-slate-400 bg-slate-400', 'border-amber-300 bg-amber-300', 'border-fuchsia-800 bg-fuchsia-800', 'border-rose-700 bg-rose-700']
      return {
        text: text[rank],
        css: css[rank]
      }
    },
    getShareSiteUrl () {
      if (typeof window === 'undefined') { return 'https://mathfive.vercel.app/' }
      return `${window.location.origin}${SHARE_SITE_PATH}`
    },
    getShareCaptionText () {
      let star = ''
      for (let i = 0; i < this.getInitStats.star; i++) {
        star += '⭐'
      }
      let form = ''
      ;(this.getAllStats.form || []).forEach((x) => {
        form += this.getTextClassForm(x).icon
      })
      const rank = this.rankMapping === '-' ? '-' : this.rankMapping
      return `MATHFIVE — ${rank} ${star} — ${form}\n${this.getShareSiteUrl()}`
    },
    copyPlainText (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text)
      }
      return new Promise((resolve, reject) => {
        try {
          if (window.clipboardData && window.clipboardData.setData) {
            window.clipboardData.setData('Text', text)
            resolve()
            return
          }
          if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            const textarea = document.createElement('textarea')
            textarea.textContent = text
            textarea.style.position = 'fixed'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            resolve()
            return
          }
          reject(new Error('no clipboard API'))
        } catch (e) {
          reject(e)
        }
      })
    },
    shareRankPillFill () {
      const map = {
        bronze: '#d97706',
        silver: '#94a3b8',
        gold: '#ca8a04',
        diamond: '#86198f',
        goat: '#be123c'
      }
      return map[this.rankMapping] || '#64748b'
    },
    formStrokeColor (form) {
      if (form === 1) { return '#059669' }
      if (form === -1) { return '#e11d48' }
      return '#94a3b8'
    },
    roundRectPath (ctx, x, y, w, h, r) {
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r)
      } else {
        const rr = Math.min(r, w / 2, h / 2)
        ctx.moveTo(x + rr, y)
        ctx.arcTo(x + w, y, x + w, y + h, rr)
        ctx.arcTo(x + w, y + h, x, y + h, rr)
        ctx.arcTo(x, y + h, x, y, rr)
        ctx.arcTo(x, y, x + w, y, rr)
        ctx.closePath()
      }
    },
    drawMortarboard (ctx, cx, cy, size, strokeColor) {
      const s = size / 24
      ctx.save()
      ctx.translate(cx - 12 * s, cy - 12 * s)
      ctx.scale(s, s)
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.stroke(new Path2D('M12 14l9-5-9-5-9 5 9 5z'))
      ctx.stroke(new Path2D('M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'))
      ctx.beginPath()
      ctx.moveTo(8, 20)
      ctx.lineTo(8, 12.5)
      ctx.stroke()
      ctx.restore()
    },
    drawStarShape (ctx, cx, cy, outerR, fillStyle) {
      const innerR = outerR * 0.4
      ctx.beginPath()
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR
        const a = (Math.PI / 2) + (i * Math.PI) / 5
        const x = cx + r * Math.cos(a)
        const y = cy - r * Math.sin(a)
        if (i === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
      }
      ctx.closePath()
      ctx.fillStyle = fillStyle
      ctx.fill()
    },
    drawShareBadge (ctx, w, h) {
      const pad = 18
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      ctx.fillStyle = '#0284c7'
      const titleY = 28
      ctx.fillText('MATH', pad, titleY)
      const wMath = ctx.measureText('MATH').width
      ctx.font = '26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('FIVE', pad + wMath, titleY)
      const rankStarsY = 58
      let x = pad
      const rankLabel = (this.rankMapping === '-' ? '-' : String(this.rankMapping)).toUpperCase()
      ctx.font = 'bold 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      const tw = ctx.measureText(rankLabel).width
      const pillW = Math.max(tw + 22, 52)
      const pillH = 22
      const pillY = rankStarsY - pillH / 2
      ctx.fillStyle = this.shareRankPillFill()
      this.roundRectPath(ctx, x, pillY, pillW, pillH, 11)
      ctx.fill()
      ctx.fillStyle = '#f8fafc'
      ctx.textBaseline = 'middle'
      ctx.fillText(rankLabel, x + pillW / 2 - tw / 2, rankStarsY)
      x += pillW + 10
      const nStar = Math.min(Math.max(Number(this.getInitStats.star) || 0, 0), 5)
      for (let i = 0; i < nStar; i++) {
        this.drawStarShape(ctx, x + 10, rankStarsY, 9, '#facc15')
        x += 22
      }
      const formRowY = 96
      let xf = pad
      const forms = this.getAllStats.form || []
      forms.forEach((f) => {
        this.drawMortarboard(ctx, xf + 11, formRowY, 22, this.formStrokeColor(f))
        xf += 26
      })
    },
    buildShareImageBlob () {
      return new Promise((resolve) => {
        const pad = 18
        const forms = this.getAllStats.form || []
        const rankLabel = (this.rankMapping === '-' ? '-' : String(this.rankMapping)).toUpperCase()
        const temp = document.createElement('canvas').getContext('2d')
        temp.font = 'bold 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        const tw = temp.measureText(rankLabel).width
        const pillW = Math.max(tw + 22, 52)
        const nStar = Math.min(Math.max(Number(this.getInitStats.star) || 0, 0), 5)
        const rowRankStarsW = pad + pillW + 10 + nStar * 22 + pad
        temp.font = 'bold 26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        const wMathTitle = temp.measureText('MATH').width
        temp.font = '26px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        const wFiveTitle = temp.measureText('FIVE').width
        const titleRowW = pad * 2 + wMathTitle + wFiveTitle
        const rowFormW = pad + forms.length * 26 + pad
        const contentW = Math.max(titleRowW, rowRankStarsW, rowFormW)
        const w = Math.max(320, Math.min(520, contentW))
        const h = 124
        const canvas = document.createElement('canvas')
        const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.scale(dpr, dpr)
        this.drawShareBadge(ctx, w, h)
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      })
    },
    async shareCopyText () {
      try {
        await this.copyPlainText(this.getShareCaptionText())
        this.showSnackbar('Teks & link disalin')
      } catch (error) {
        this.showSnackbar(`Gagal salin teks. [${error}]`)
      }
    },
    async shareCopyImage () {
      try {
        if (!navigator.clipboard || !window.ClipboardItem) {
          this.showSnackbar('Browser tidak mendukung salin gambar')
          return
        }
        const blob = await this.buildShareImageBlob()
        if (!blob) {
          this.showSnackbar('Gagal membuat gambar')
          return
        }
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: Promise.resolve(blob) })
        ])
        this.showSnackbar('Gambar disalin — tempel di sosmed')
      } catch (error) {
        this.showSnackbar(`Gagal salin gambar (izin / HTTPS). [${error}]`)
      }
    },
    latestOutcomeKey (rslt) {
      if (rslt.outcome === 'up' || rslt.outcome === 'down' || rslt.outcome === 'stay') {
        return rslt.outcome
      }
      if (rslt.isRankUp) { return 'up' }
      if (rslt.isRankDown) { return 'down' }
      return 'stay'
    },
    getLatestOutcomeLabel (rslt) {
      const labels = { up: 'Naik', down: 'Turun', stay: 'Tetap' }
      return labels[this.latestOutcomeKey(rslt)]
    },
    getLatestOutcomeClass (rslt) {
      const key = this.latestOutcomeKey(rslt)
      const classes = {
        up: 'bg-emerald-600 border-emerald-700',
        down: 'bg-rose-600 border-rose-700',
        stay: 'bg-slate-500 border-slate-600'
      }
      return classes[key]
    },
    getLatestReasonLines (rslt) {
      if (rslt.reasonLines && rslt.reasonLines.length) {
        return rslt.reasonLines
      }
      return []
    },
    startMath () {
      this.isStarted = true
      this.init()
    },
    shuffleArray (arr) {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },
    buildShuffledChoices (correct) {
      const n = Number(correct)
      const set = new Set([n])
      const offsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 10, -10]
      this.shuffleArray(offsets)
      for (const o of offsets) {
        if (set.size >= 4) { break }
        const d = n + o
        if (!set.has(d)) { set.add(d) }
      }
      let step = 8
      while (set.size < 4) {
        const d = n + step * (set.size % 2 === 0 ? 1 : -1)
        step++
        if (!set.has(d)) { set.add(d) }
      }
      return this.shuffleArray(Array.from(set))
    },
    async init () {
      const x = new MathQuestion(this.getInitStats.rank, this.getInitStats.star, 5)
      const raw = x.makeQuestion()
      this.questions = raw.map(q => ({
        ...q,
        choices: this.buildShuffledChoices(q.answer)
      }))
      this.currentTimeStart = new Date().getTime()
      this.result = []
      this.currentQuestion = 0
      // this.countdownTimer = this.getCurrentTimeLimit
      // this.startCountdown()
      await this.$nextTick()
    },
    async confirmAnswer (qst, chosen) {
      const picked = Number(chosen)
      if (Number.isNaN(picked)) { return }
      const timeEnd = new Date().getTime()
      this.result.push({
        ...qst,
        myAnswer: picked,
        isCorrect: qst.answer === picked,
        timeSpent: timeEnd - this.currentTimeStart
      })
      this.currentTimeStart = timeEnd
      // this.countdownTimer = this.getCurrentTimeLimit
      if (this.currentQuestion < 4) { this.currentQuestion++ }
      await this.$nextTick()
    },
    // handle attempt calculation and end of game if user has no attempt left
    handleAttempts () {
      this.reduceAttemptRemaining()
      // user still has attempt
      if (this.getAttemptRemaining > 0) {
        this.setForage()
        this.init()
      } else {
        // to handle next game time for user
        this.setLatestAttemptDate(new Date().getTime())
        this.setForage()
      }
    },
    goNextRankStar () {
      // save result and insert to stat related store
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime })
      // set next rank star in store
      this.nextRankStar()
      // update localForage
      this.setForage()
      this.init()
    },
    goPrevRankStar () {
      // save result and insert to stat related store
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime })
      // set prev rank star in store
      this.prevRankStar()
      this.handleAttempts()
    },
    retry () {
      this.saveResult({ result: this.result, rUp: this.isEligibleStarUp, rDown: this.isEligibleStarDown, avg: this.getAvgTime })
      this.handleAttempts()
    },
    // update localForage
    async setForage () {
      await this.$localForage.setItem('mathfive', this.getAllStore)
    },
    showSnackbar (msg) {
      this.snackbar = msg
      this.snackbarToggle = true
      setTimeout(() => {
        this.snackbarToggle = false
        this.snackbar = ''
      }, 2000)
    },
    startCountdown () {
      setTimeout(() => {
        this.countdownTimer--
        if (this.countdownTimer > 0) { this.startCountdown() }
      }, 1000)
    },
    closeRules () {
      this.saveConfig({
        isReadRules: true
      })
      this.setForage()
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
