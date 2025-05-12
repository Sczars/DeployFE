import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    useEffect(()=>{const token = localStorage.getItem("access_token")
        if(token) {
            navigate({ to: "/dashboard", replace: true });
        } else {
            navigate({ to: "/login", replace: true });
        }
    }, [])

    return null
}
