<template>
  <div class="text-center">
    <div v-show="!isReadRules || isOpen" class="text-left bg-white p-2 absolute inset-0 flex flex-col justify-between">
      <div class="pb-9">
        <p class="border-0 border-b-2 border-slate-100 text-slate-500 text-sm font-bold uppercase pb-1 mb-1">
          Sistem Rank & Bintang :
        </p>
        <ul class="list-inside list-decimal mb-4 leading-5">
          <li class="mb-2">
            Terdapat <b>5 ranks</b>
            <span class="border-amber-600 bg-amber-600 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">bronze</span>
            <span class="border-slate-400 bg-slate-400 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">silver</span>
            <span class="border-amber-300 bg-amber-300 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">gold</span>
            <span class="border-fuchsia-800 bg-fuchsia-800 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">diamond</span>
            <span class="border-rose-700 bg-rose-700 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">goat</span>
          </li>
          <li class="mb-2">
            Setiap kali Kamu menyelesaikan sebuah pertanyaan, <b>Kamu bakal mendapatkan 1 bintang</b>
          </li>
          <li class="mb-2">
            Setelah mendapatkan 5 bintang, <b>rank Kamu bakal naik dan bintang kamu akan ter-reset menjadi 1 bintang lagi</b> di pertanyaan berikutnya
          </li>
        </ul>
        <p class="border-0 border-b-2 border-slate-100 text-slate-500 text-sm font-bold uppercase mb-1 pb-1">
          Aturan :
        </p>
        <ul class="list-inside list-decimal leading-5">
          <li class="mb-2">
            Ada <b>5 pertanyaan matematika simple</b> di setiap ronde. Tingkat kesusahan berdasarkan rank dan bintangmu
          </li>
          <li class="mb-2">
            Kamu harus menyelesaikan setiap dalam waktu <b>kurang dari 4/5/6/7/8 detik</b> berdasarkan rank
          </li>
          <li class="mb-2">
            Kamu punya <b>5 kali kesempatan untuk gagal </b>setiap harinya. Kesempatan akan ter-reset <b>setelah Kamu menunggu 24 jam </b>
          </li>
          <li class="mb-2">
            Setiap kali kamu gagal menyelesaikan 1 ronde, kamu akan kehilangan <b>1 kesempatan</b>. <b>GAME IS OVER</b> ketika kesempatanmu habis
          </li>
          <li class="mb-2">
            Jika kamu gagal dan <b>cuma berhasil menjawab < 2 pertanyaan dengan benar atau rata-rata waktu menjawab lebih dari 7/8/9/10/11 detik</b> maka kamu akan kehilangan 1 bintang
          </li>
          <li class="mb-2">
            Setinggi apa rank yang bisa kamu capai ? Copy hasilmu di akhir permainan dan paste ke twitter or other social media ;) and tag me <b>@agungdlgs</b>
          </li>
          <li class="mb-2">
            Contoh pertanyaan untuk rank <span class="border-slate-400 bg-slate-400 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">silver</span> :
            <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">
              2 + 3 - 4
            </div>
            Contoh pertanyaan untuk rank <span class="border-fuchsia-800 bg-fuchsia-800 border-2 px-3 py-0 text-slate-100 rounded-2xl text-xs font-bold uppercase">diamond</span> rank:
            <div class="text-sky-600 text-xl font-black mb-2 text-center my-2">
              2 + 3 - 4 * 3 + 9
            </div>
          </li>
        </ul>
      </div>
      <button class="fixed bottom-2 left-2 right-2 text-center uppercase bg-sky-600 hover:bg-sky-800 p-2 transition ease-in-out duration-300 text-slate-100 rounded text-sm font-medium" @click="closeRules">
        Close Game Rules
      </button>
    </div>
    <p class="mb-4 mt-2 text-sky-600 text-base font-medium underline" @click="isOpen=true">
      Read Game Rules
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 inline"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    </p>
  </div>
</template>
<script>
export default {
  name: 'MathRules',
  props: {
    isReadRules: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    isOpen: false
  }),
  methods: {
    closeRules () {
      this.isOpen = false
      this.$emit('closeRules')
    }
  }
}
</script>
