'use client'
import { useState } from 'react'
export default function Gallery({ images, name }) {
  const [i, setI] = useState(0)
  return (
    <div className="gal">
      <div className="main"><img src={images[i]} alt={name} /></div>
      {images.length > 1 && <div className="thumbs">{images.map((s, k) => <button key={s} className={k === i ? 'on' : ''} onClick={() => setI(k)}><img src={s} alt="" /></button>)}</div>}
    </div>
  )
}
