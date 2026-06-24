import RegisterClient from './RegisterClient'

export const metadata = {
  title: 'Crear cuenta - FarmiYa',
}

export default function RegisterPage() {
  return (
    <div className="flex items-start justify-center px-4 pt-12 pb-20 sm:pt-16">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <p className="font-bold text-[22px] tracking-tight">
            <span className="text-[#1a1b1f]">Far</span>
            <span className="text-primary">mi</span>
          </p>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1a1b1f] mt-2 tracking-tight">
            Crea tu cuenta gratis
          </h1>
          <p className="text-[13px] text-[#717786] mt-1">
            Guarda medicamentos y sigue el historial de precios
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-6 sm:p-7">
          <RegisterClient />
        </div>
      </div>
    </div>
  )
}
