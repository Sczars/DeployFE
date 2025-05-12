import { createFileRoute } from '@tanstack/react-router'
import Signup from '../component/Signup'

export const Route = createFileRoute('/signup')({
  component: Signup,
})
