import LoginClient from './LoginClient'

export const metadata = {
  title: 'Iniciar sesión',
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return (
    <div className="flex items-start justify-center px-4 pt-12 pb-20 sm:pt-20">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <p className="font-bold text-[22px] tracking-tight">
            <span className="text-[#1a1b1f]">Far</span>
            <span className="text-primary">mi</span>
          </p>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1a1b1f] mt-2 tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-[13px] text-[#717786] mt-1">
            Inicia sesión para ver tu lista y seguimiento de precios
          </p>
        </div>

        <img
          src="/fotos/logo-farmi-app.webp"
          alt="Logo de Farmi en la pantalla de un celular"
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
          className="w-full h-[140px] object-cover rounded-2xl shadow-sm mb-4"
        />

        <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-6 sm:p-7">
          <LoginClient />
        </div>
      </div>
    </div>
  )
}
