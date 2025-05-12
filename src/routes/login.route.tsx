import { createFileRoute } from '@tanstack/react-router'
import Login from '../component/Login'

export const Route = createFileRoute('/login')({
  component: Login,
})