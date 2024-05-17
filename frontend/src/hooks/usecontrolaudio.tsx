import create from 'zustand'
import { devtools } from 'zustand/middleware'


interface PagesProps {
 audiostatus: string,
 setaudiostatus: (status: string) => void
}

export const usecontrolaudio = create<PagesProps>()(
  devtools(
    set => ({
    audiostatus: 'initial',
    setaudiostatus: (status: string) => set({audiostatus: status})
    }),
    { name: 'question' }
  )
)
