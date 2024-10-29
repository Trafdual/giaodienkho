/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect,useState } from 'react'
import { ModalBig } from '~/components/ModalBig'

function EditSanPham ({ sku, idloaisp, isOpen, onClose }) {

  const fetchdata = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getsanphambySKU/${sku}/${idloaisp}`
      )
      const data = await response.json()
      if (response.ok) {
        console.log(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  console.log(idloaisp)
  useEffect(() => {
    if(isOpen && sku && idloaisp){
        fetchdata()
    }
  }, [sku, idloaisp, isOpen])
  return <ModalBig isOpen={isOpen} onClose={onClose}></ModalBig>
}

export default EditSanPham
