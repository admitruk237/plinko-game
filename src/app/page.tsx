import { redirect } from 'next/navigation'
import { getRefreshToken } from '@/shared/lib/session'
import { ROUTES } from '@/shared/config'

const HomePage = async () => {
  const refreshToken = await getRefreshToken()
  redirect(refreshToken ? ROUTES.GAME : ROUTES.LOGIN)
}

export default HomePage
