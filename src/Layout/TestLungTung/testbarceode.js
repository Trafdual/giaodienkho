import React,{useState} from 'react'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

function Testbarceode() {
   const [data, setData] = useState('barcode')

return (
  <>
    <BarcodeScannerComponent
      width={500}
      height={500}
      onUpdate={(err, result) => {
        if (result) setData(result.text)
        else setData('Not Found')
      }}
    />
    <p>{data}</p>
  </>
)

}

export default Testbarceode;