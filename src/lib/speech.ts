export type SupportedSpeechLang = 'nl-NL' | 'uk-UA'

let currentAudio: HTMLAudioElement | null = null

const getLangPrefix = (lang: SupportedSpeechLang) => {
  if (lang === 'nl-NL') {
    return 'nl'
  }

  return 'uk'
}

const getNativeVoice = (voices: SpeechSynthesisVoice[], lang: SupportedSpeechLang) => {
  const exactVoice = voices.find(
    (voice) => voice.lang.toLowerCase() === lang.toLowerCase()
  )

  if (exactVoice) {
    return exactVoice
  }

  const prefix = getLangPrefix(lang)
  return voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix))
}

const buildRemoteTtsUrls = (text: string, lang: SupportedSpeechLang) => {
  const prefix = getLangPrefix(lang)
  const query = encodeURIComponent(text.trim())

  return [
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${prefix}&q=${query}`,
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${prefix}&q=${query}`
  ]
}

const playRemoteAudio = (text: string, lang: SupportedSpeechLang) => {
  const urls = buildRemoteTtsUrls(text, lang)
  const audio = new Audio()
  audio.preload = 'auto'

  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }

  currentAudio = audio
  let currentUrlIndex = 0

  const tryPlay = () => {
    if (currentUrlIndex >= urls.length) {
      console.error(`Remote speech playback failed for ${lang}: all endpoints unavailable`)
      return
    }

    audio.src = urls[currentUrlIndex]
    currentUrlIndex += 1

    void audio.play().catch((error) => {
      console.error('Remote speech playback failed:', error)
      tryPlay()
    })
  }

  tryPlay()

  return true
}

export const preloadSpeechVoices = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return () => {}
  }

  const synth = window.speechSynthesis
  const prepareVoices = () => {
    synth.getVoices()
  }

  prepareVoices()
  synth.onvoiceschanged = prepareVoices

  return () => {
    synth.cancel()
    synth.onvoiceschanged = null

    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
  }
}

export const speakText = (text: string, lang: SupportedSpeechLang) => {
  if (typeof window === 'undefined' || !text.trim()) {
    return false
  }

  if (!window.speechSynthesis) {
    return playRemoteAudio(text, lang)
  }

  const synth = window.speechSynthesis
  const voices = synth.getVoices()
  const voice = getNativeVoice(voices, lang)

  if (voice) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = voice
    utterance.lang = lang
    utterance.rate = 0.9

    synth.cancel()
    synth.speak(utterance)

    return true
  }

  return playRemoteAudio(text, lang)
}
