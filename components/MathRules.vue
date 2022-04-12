<template>
<div class="text-center">
  <div class="text-left border-2 bg-white border-slate-100 p-2 absolute inset-0 flex flex-col justify-between" v-show="toggle">
    <div>
      <p class="border-0 border-b-2 border-slate-100 text-slate-500 text-sm font-bold uppercase mb-1 pb-1">General Rules:</p>
      <ul class="list-inside list-decimal mb-4 leading-5">
        <li class="mb-2">There are <b>5 simple math questions</b> each round. Difficulty is based on your rank and star. 
          example <span class="border-slate-400 bg-slate-400 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">silver</span> rank:
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">2 + 3 - 4</div>
          example <span class="border-fuchsia-800 bg-fuchsia-800 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">diamond</span> rank:
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">2 + 3 - 4 * 3 / 9</div>
        </li>
        <li class="mb-2">if there is decimal answer because of divison operator, <b>round it to the bottom unit</b>. for example:
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">2 + 3 - 4 * 3 / 9</div>
          answer is 
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2 inline">3</div> not <div class="text-sky-600 text-xl font-black mb-2 text-center my-2 inline">3.66667</div>
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">2/4 - 5</div>
          answer is 
          <div class="text-sky-600 text-xl font-black mb-2 text-center my-2 inline">-5</div> not <div class="text-sky-600 text-xl font-black mb-2 text-center my-2 inline">-4.5</div>
        </li>
        <li class="mb-2">You have to solve all of them on average <b>less than 5 seconds (4/5/6/7/8s based on your rank)</b> to be able to rank up</li>
        <li class="mb-2">You will be given <b>5 fail attempts every day</b></li>
        <li class="mb-2">You can try again if you fail but it will <b>cost you 1 attempt</b></li>
        <li class="mb-2">If you failed badly in a round <b>(score < 2 or average time > 7/8/9/10/11s )</b>, you will be <b>star down</b>, so be carefull</li>
      </ul>
      <p class="border-0 border-b-2 border-slate-100 text-slate-500 text-sm font-bold uppercase pb-1 mb-1">Rank & Star System :</p>
      <ul class="list-inside list-decimal mb-4 leading-5">
        <li class="mb-2">
          There are <b>5 ranks</b> 
          <span class="border-amber-600 bg-amber-600 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">bronze</span>
          <span class="border-slate-400 bg-slate-400 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">silver</span>
          <span class="border-amber-300 bg-amber-300 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">gold</span>
          <span class="border-fuchsia-800 bg-fuchsia-800 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">diamond</span>
          <span class="border-rose-700 bg-rose-700 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">goat</span>
        </li>
        <li class="mb-2">Each time you complete a round, <b>you will be given 1 star</b></li>
        <li class="mb-2">After collecting 5 stars, <b>your rank will be increased and start with one star</b> in next round</li>
      </ul>
    </div>
    <button @click="toggle=!toggle" class="text-center uppercase bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-sm font-medium">Close Game Rules</button>
  </div>
  <p @click="toggle=!toggle" class="mb-4 mt-2 text-sky-600 text-base font-medium underline">
    Read Game Rules
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  </p>
</div>
</template>
<script>
export default {
  name: 'MathRules',
  data:() => ({
    toggle: false,
  }),
}
</script>
