import React, { useState, useEffect } from 'react'

function Image () {
  const [currentIndex, setCurrentIndex] = useState(0)

  const image = [
    'https://i.pinimg.com/originals/62/3b/ee/623beec6ee77a4acd5482fd93645add4.jpg',
    'https://i.pinimg.com/736x/e8/81/cf/e881cfbefd2447e1b5e9767bc920e177.jpg',
    'https://i.pinimg.com/736x/cd/34/f2/cd34f2d98b266f33b2b42d40b2162b30.jpg'
  ]
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % image.length)
    }, 10000) 

    return () => clearInterval(intervalId)
  }, [image.length])

  return (
    <div>
      {image.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Background ${index}`}
          className={index === currentIndex ? 'active' : ''}
        />
      ))}
    </div>
  )
}

export default Image
