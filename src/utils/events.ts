import { documentElem, DomTools, windowElem } from './doms'
import { VmaComponentInstance } from '../types'

const wheelName = DomTools.isFirefox ? 'DOMMouseScroll' : 'mousewheel'
const eventStore: {
  comp: VmaComponentInstance
  type: string
  cb: (event: Event) => void
}[] = []

function triggerEvent(event: Event) {
  const isWheel = event.type === wheelName
  eventStore.forEach(({ type, cb }) => {
    if (type === event.type || (isWheel && type === 'mousewheel')) {
      cb(event)
    }
  })
}

export const GlobalEvent = {
  on(comp: VmaComponentInstance, type: string, cb: any) {
    if (cb) {
      eventStore.push({ comp, type, cb })
    }
  },
  off(comp: VmaComponentInstance, type: string) {
    console.log(comp, type)
  },
  trigger: triggerEvent,
}

if (documentElem) {
  document.addEventListener('contextmenu', triggerEvent, false)
}
if (windowElem) {
  window.addEventListener('mousedown', triggerEvent, false)
  window.addEventListener('mousewheel', triggerEvent, false)
}

export default GlobalEvent
