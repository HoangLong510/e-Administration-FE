import React, { useEffect } from 'react'
import { fetchUserApi } from './service'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setUser } from '~/libs/features/user/userSlice'
import { useState } from 'react'

export default function AuthProvider({ children }) {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.value)

    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        const res = await fetchUserApi()

        if (res.success) {      // success
            dispatch(setUser(res.user))
        } else {                //error
            if (res.error && res.error.server) {
                alert("Server error! Please try again later.")
                return
            } else {
                if (user.exists) {
                    dispatch(clearUser())
                }
            }
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchUser()
        setInterval(() => {
            if (user.exists) {
                fetchUser()
            }
        }, 2 * 60 * 1000)
    }, [])

    if (loading) {
        return (
            <></>
        )
    }

    return <> {children} </>
}
