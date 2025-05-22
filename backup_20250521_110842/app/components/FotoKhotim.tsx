import Image from 'next/image'

export default function FotoKhotim() {
  return (
    <div className="relative">
      <Image
        src="/foto_chotim.jpg"
        alt="Foto Khotim"
        width={120}
        height={120}
        className="rounded-full border-2 border-blue-700 shadow-md object-cover"
        priority
      />
    </div>
  )
} 