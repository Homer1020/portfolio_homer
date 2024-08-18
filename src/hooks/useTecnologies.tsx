import { useEffect, useState } from "react"
import { supabase } from "../config/supabase"
import type { Option } from "../types"

export default function useTecnologies() {
  const [tecnologies, setTecnologies] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  useEffect(() => {
    if(!tecnologies.length) {
      supabase
        .from('tecnologies')
        .select()
        .then(({ data }) => {
          if(data) {
            setTecnologies(data.map(tecnology => ({label: tecnology.tecnology, value: `${ tecnology.id }`})))
          }
        })
    }
  }, [])

  const addTecnology = async (inputValue: string) => {
    setIsLoading(true)
    const fd = new FormData()
    fd.append('tecnology', inputValue)
    const res = await fetch('/api/tecnologies/store', {
      method: 'POST',
      body: fd
    })
    const { data } = await res.json()
    const newOption = {
      label: data[0].tecnology,
      value: data[0].id
    }
    setIsLoading(false)
    setTecnologies(prev => [...prev, newOption])
    return newOption
  }

  return { tecnologies, addTecnology, isLoading }
}