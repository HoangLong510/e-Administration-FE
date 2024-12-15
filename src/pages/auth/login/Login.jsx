import { Button, CircularProgress, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FixedHeightTextField from "~/components/MuiCustom/FixedHeightTextField"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { clearLoading, setLoading } from "~/libs/features/loading/loadingSlice"
import { loginApi } from "./service"
import { setUser } from "~/libs/features/user/userSlice"
import { setPopup } from "~/libs/features/popup/popupSlice"

function Login() {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.loading.value)

    const [error, setError] = useState(true)
    const [errorUsername, setErrorUsername] = useState("")
    const [errorPassword, setErrorPassword] = useState("")

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // validate fields
    useEffect(() => {
        if (username === "" || username.trim() === "") {
            setErrorUsername("Please enter your username")
        } else {
            setErrorUsername("")
        }

        if (password === "" || password.trim() === "") {
            setErrorPassword("Please enter your password")
        } else {
            setErrorPassword("")
        }
    }, [username, password])

    // set error if exists errorUsername or errorPassword
    useEffect(() => {
        if (errorUsername || errorPassword) {
            setError(true)
        } else {
            setError(false)
        }
    }, [errorUsername, errorPassword])

    // handle form submit
    const handleLogin = async (e) => {
        e.preventDefault()

        if (!error && !loading) {
            dispatch(setLoading())
            const user = {
                username,
                password
            }

            const res = await loginApi(user)
            dispatch(clearLoading())

            if (res.success) {      // success
                dispatch(setUser(res.user))
            } else {                // error
                if (res.errors) {
                    setErrorUsername(res.errors.username)
                    setErrorPassword(res.errors.password)
                }
                const dataPopup = {
                    type: 'error',
                    message: res.message
                }
                dispatch(setPopup(dataPopup))
            }
        }
    }

    useEffect(() => {
        AOS.init({
            duration: 1000
        })
    }, [])

    return (
        <Box sx={{
            backgroundImage: "url('/images/background/background1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            padding: '40px 20px',
            overflow: "hidden"
        }}>
            <Box data-aos="slide-up" sx={{
                width: '100%',
                maxWidth: '450px',
                borderRadius: '10px',
                padding: '30px 20px',
                bgcolor: '#fff',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <Box sx={{
                    width: '100%',
                    mb: 2
                }}>
                    <Typography sx={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#000'
                    }}>
                        Login
                    </Typography>
                    <Typography sx={{
                        mt: 1,
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Login with your account
                    </Typography>
                </Box>
                <form onSubmit={handleLogin}>
                    <FixedHeightTextField
                        fullWidth
                        type="text"
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        autoComplete='off'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        helperText={errorUsername}
                        color={errorUsername ? 'error' : 'success'}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <FixedHeightTextField
                        fullWidth
                        type="password"
                        label="Password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        helperText={errorPassword}
                        color={errorPassword ? 'error' : 'success'}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    {!loading && (
                        <Button sx={{ textTransform: 'none', mt: 3 }}
                            fullWidth
                            type="submit"
                            variant="contained"
                        >
                            Login
                        </Button>
                    )}
                    {loading && (
                        <Button sx={{ textTransform: 'none', mt: 3 }}
                            fullWidth
                            variant="contained"
                        >
                            <CircularProgress color="inherit" size={"25px"} />
                        </Button>
                    )}
                </form>

                <Box sx={{
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#666',
                    fontSize: '13px'
                }}>
                    Accounts are provided by the administrator only
                </Box>
            </Box>
        </Box>
    )
}

export default Login