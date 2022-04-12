export const state = () => ({
  latestAttemptDate: 0, // done
  currentRank: 1,
  currentStar: 1,
  attemptRemaining: 5,
  generalStats: {
    highestRank: 1,
    fastestTime: 9999999,
    longestTime: 0,
    totalWin: 0,
    totalLose: 0,
    form: [],
  },
  history: [],
})

function getHours(time) {
  return Math.floor(time/(60*60*1000));
}
function getMinutes(time) {
 return Math.floor((time / (60*60*1000) - Math.floor(time / (60*60*1000)))*60);
}

export const getters = {
  isEligibleToPlay(state) {
    return Date.now() - state.latestAttemptDate >= 86400000;
  },
  getTimeToNextPlay(state) {
    const time = 86400000 + state.latestAttemptDate - Date.now();
    return `${getHours(time)} hours ${getMinutes(time)} minutes`;
  },
  isEmptyAttempts(state) {
    return state.attemptRemaining === 0;
  },
  getAttemptRemaining(state) {
    return state.attemptRemaining;
  },
  getInitStats(state) {
    const { currentRank: rank, currentStar: star} = state;
    return {
      rank,
      star,
    }
  },
  getAllStats(state) {
    return state.generalStats;
  },
  getAllStore(state) {
    return state;
  },
  getLatestResult(state) {
    const { history } = state;
    
    return history.slice(history.length-5,history.length).sort().reverse();
  },
}

export const mutations = {
  addHistory(state, result) {
    state.history = [...state.history, result];
  },
  setLatestAttemptDate(state, date) {
    console.log(date);
    state.latestAttemptDate = date;
    console.log(state.latestAttemptDate);
  },
  setRemainingAttempt(state, payload) {
    state.attemptRemaining = payload;
  },
  setStore(state, store) {
    const { currentRank, currentStar, latestAttemptDate, attemptRemaining, generalStats, history } = store;
    state.currentRank = currentRank;
    state.currentStar = currentStar;
    state.history = history;
    state.latestAttemptDate = latestAttemptDate;
    state.attemptRemaining = attemptRemaining;
    state.generalStats = generalStats;
  },
  reduceAttemptRemaining(state) {
    state.attemptRemaining--;
  },
  nextRankStar(state) {
    if (state.currentStar === 5) {
      state.currentStar = 1;
      state.currentRank++;
    } else {
      state.currentStar++;
    }
  },
  prevRankStar(state) {
    if (state.currentStar === 1) {
      state.currentStar = 5;
      state.currentRank--;
    } else {
      state.currentStar--;
    }
  },
  setGeneralStats(state, general) {
    state.generalStats = { ...general };
  }
}

export const actions = {
  saveResult({ commit, getters }, payload) {
    const { result, rUp, rDown, avg } = payload;
    const history = {
      score: result.filter(rs => rs.isCorrect === true).length,
      isRankUp: rUp,
      isRankDown: rDown,
      averageTime: avg,
      round: result.map(rs => rs.isCorrect),
    };
    const currentGeneral = { ...getters.getAllStats };
    const rank = getters.getInitStats.rank;
    const time = result.map(rs => rs.timeSpent);
    let form = 0;
    if (rUp) {
      form = 1
    } else if (rDown) {
      form = -1
    };
    const general = {
      highestRank: currentGeneral.highestRank > rank ? currentGeneral.highestRank : rank,
      fastestTime: currentGeneral.fastestTime < Math.min(...time)/1000 ? currentGeneral.fastestTime : Math.min(...time)/1000,
      longestTime: currentGeneral.longestTime > Math.max(...time)/1000 ? currentGeneral.longestTime : Math.max(...time)/1000,
      totalWin: rUp ? currentGeneral.totalWin + 1 : currentGeneral.totalWin,
      totalLose: !rUp ? currentGeneral.totalLose + 1 : currentGeneral.totalLose,
      form: [form, ...currentGeneral.form].slice(0, 10),
    }
    commit('setGeneralStats', general);
    commit('addHistory', history);
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}