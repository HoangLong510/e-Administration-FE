import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '~/libs/store'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '~/theme'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</Provider>
)
