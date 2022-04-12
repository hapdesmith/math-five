<template>
  <div div class="fixed top-0 left-0 right-0 w-full p-4 bg-white shadow-lg shadow-slate-100 flex flex-row justify-between items-center">
    <div>
      <h1 class="text-sky-600 font-black text-xl">MATH<span class="text-slate-300">{{ getAttemptMapping }}</span></h1>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
      <span :class="`border-2 ${getRankClass.box} px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase`">{{ rankMapping }}</span>
      <svg v-for="x in star" :key="`star-${x}`"  xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 ${getRankClass.text} inline`" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <!-- <button @click="this.$emit('onStats')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button> -->
  </div>
</template>
<script>
export default ({
  name: 'MathHeader',
  props: {
    rankMapping: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
    }
  },
  computed: {
    getAttemptMapping() {
      return ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'][this.attempts];
    },
    getRankClass() {
      return {
        bronze: {
          text: 'text-amber-600',
          box: 'border-amber-600 bg-amber-600',
        },
        silver: {
          text: 'text-slate-400',
          box: 'border-slate-400 bg-slate-400',
        },
        gold: {
          text: 'text-amber-300',
          box: 'border-amber-300 bg-amber-300',
        },
        diamond: {
          text: 'text-fuchsia-800',
          box: 'border-fuchsia-800 bg-fuchsia-800',
        },
        goat: {
          text: 'text-rose-700',
          box: 'border-rose-700 bg-rose-700',
        }
      }[this.rankMapping];
    },
  }
})
</script>
