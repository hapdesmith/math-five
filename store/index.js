export const state = () => ({
  latestAttemptDate: 0, // done
  currentRank: 1,
  currentStar: 1,
  attemptRemaining: 5,
  generalStats: {
    highestRank: 1,
    highestStar: 1,
    fastestTime: 9999999,
    longestTime: 0,
    totalWin: 0,
    totalLose: 0,
    form: []
  },
  history: [],
  config: {
    isReadRules: false
  }
})

/** Cooldown setelah attempt habis sebelum bisa main lagi */
const COOLDOWN_MS = 30 * 60 * 1000

function formatTimeToNextPlay (ms) {
  const t = Math.max(0, ms)
  const totalSec = Math.ceil(t / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m > 0) {
    return `${m} menit ${s} detik`
  }
  return `${s} detik`
}

export const getters = {
  isEligibleToPlay (state) {
    return Date.now() - state.latestAttemptDate >= COOLDOWN_MS
  },
  getTimeToNextPlay (state) {
    const remaining = COOLDOWN_MS + state.latestAttemptDate - Date.now()
    return formatTimeToNextPlay(remaining)
  },
  isEmptyAttempts (state) {
    return state.attemptRemaining === 0
  },
  getAttemptRemaining (state) {
    return state.attemptRemaining
  },
  getInitStats (state) {
    const { currentRank: rank, currentStar: star } = state
    return {
      rank,
      star
    }
  },
  getAllStats (state) {
    return state.generalStats
  },
  getAllStore (state) {
    return state
  },
  getLatestResult (state) {
    return [...state.history].reverse()
  },
  getConfig (state) {
    const { config } = state
    return config
  }
}

function peakIsBetter (rank, star, bestRank, bestStar) {
  return rank > bestRank || (rank === bestRank && star > bestStar)
}

/** Naikkan rekor rank+bintang jika posisi saat ini lebih tinggi */
function bumpHighestPeak (state) {
  const { highestRank, highestStar } = state.generalStats
  const r = state.currentRank
  const s = state.currentStar
  if (peakIsBetter(r, s, highestRank, highestStar)) {
    state.generalStats.highestRank = r
    state.generalStats.highestStar = s
  }
}

export const mutations = {
  addHistory (state, result) {
    state.history = [...state.history, result]
  },
  setLatestAttemptDate (state, date) {
    state.latestAttemptDate = date
  },
  setRemainingAttempt (state, payload) {
    state.attemptRemaining = payload
  },
  setStore (state, store) {
    const { currentRank, currentStar, latestAttemptDate, attemptRemaining, generalStats, history, config } = store
    state.currentRank = currentRank
    state.currentStar = currentStar
    state.history = history
    state.latestAttemptDate = latestAttemptDate
    state.attemptRemaining = attemptRemaining
    state.generalStats = {
      ...generalStats,
      highestStar: generalStats.highestStar != null ? generalStats.highestStar : 1
    }
    state.config = config
    bumpHighestPeak(state)
  },
  reduceAttemptRemaining (state) {
    state.attemptRemaining--
  },
  nextRankStar (state) {
    if (state.currentStar === 5) {
      state.currentStar = 1
      state.currentRank++
    } else {
      state.currentStar++
    }
    bumpHighestPeak(state)
  },
  prevRankStar (state) {
    if (state.currentStar === 1) {
      state.currentStar = 5
      state.currentRank--
    } else {
      state.currentStar--
    }
  },
  setGeneralStats (state, general) {
    state.generalStats = { ...general }
  },
  setConfig (state, config) {
    state.config = { ...config }
  }
}

const BASE_TIME = 3

function buildOutcomeReasons ({ result, rUp, rDown, avg, rank }) {
  const score = result.filter(rs => rs.isCorrect === true).length
  const limitUp = BASE_TIME + rank
  const limitDown = 2 * BASE_TIME + rank
  const tooManyWrong = score <= 2
  const tooSlow = avg >= limitDown

  let outcome = 'stay'
  if (rUp) {
    outcome = 'up'
  } else if (rDown) {
    outcome = 'down'
  }

  const reasonLines = []
  if (rUp) {
    reasonLines.push(`Skor 5/5 dan waktu rata-rata ${avg.toFixed(2)}s tidak melebihi batas naik (${limitUp}s).`)
  } else if (rDown) {
    if (tooManyWrong) {
      reasonLines.push(`Terlalu banyak salah: hanya ${score}/5 benar (penurunan jika ≤2 benar).`)
    }
    if (tooSlow) {
      reasonLines.push(`Waktu rata-rata ${avg.toFixed(2)}s melebihi batas aman (${limitDown}s).`)
    }
  } else {
    if (score < 5) {
      reasonLines.push(`Skor ${score}/5 — naik rank butuh semua jawaban benar.`)
    }
    if (score === 5 && avg > limitUp) {
      reasonLines.push(`Waktu rata-rata ${avg.toFixed(2)}s belum cukup cepat untuk naik (perlu ≤${limitUp}s).`)
    }
    if (reasonLines.length === 0) {
      reasonLines.push('Tetap: tidak memenuhi syarat naik maupun penurunan.')
    }
  }

  return { outcome, reasonLines }
}

export const actions = {
  saveResult ({ commit, getters }, payload) {
    const { result, rUp, rDown, avg } = payload
    const rank = getters.getInitStats.rank
    const { outcome, reasonLines } = buildOutcomeReasons({ result, rUp, rDown, avg, rank })
    const history = {
      score: result.filter(rs => rs.isCorrect === true).length,
      isRankUp: rUp,
      isRankDown: rDown,
      averageTime: avg,
      round: result.map(rs => rs.isCorrect),
      outcome,
      reasonLines
    }
    const currentGeneral = { ...getters.getAllStats }
    const time = result.map(rs => rs.timeSpent)
    let form = 0
    if (rUp) {
      form = 1
    } else if (rDown) {
      form = -1
    };
    const general = {
      highestRank: currentGeneral.highestRank,
      highestStar: currentGeneral.highestStar != null ? currentGeneral.highestStar : 1,
      fastestTime: currentGeneral.fastestTime < Math.min(...time) / 1000 ? currentGeneral.fastestTime : Math.min(...time) / 1000,
      longestTime: currentGeneral.longestTime > Math.max(...time) / 1000 ? currentGeneral.longestTime : Math.max(...time) / 1000,
      totalWin: rUp ? currentGeneral.totalWin + 1 : currentGeneral.totalWin,
      totalLose: !rUp ? currentGeneral.totalLose + 1 : currentGeneral.totalLose,
      form: [form, ...currentGeneral.form].slice(0, 10)
    }
    commit('setGeneralStats', general)
    commit('addHistory', history)
  },
  saveConfig ({ commit }, config) {
    commit('setConfig', config)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
