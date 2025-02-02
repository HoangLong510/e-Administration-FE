import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import authRoutes from "~/routes/authRoutes"
import protectedRoutes from "~/routes/protectedRoutes"
import NoLayout from "~/layouts/NoLayout"
import Popup from "~/components/Popup/Popup"
import AuthProvider from "~/providers/AuthProvider"
import PopupLogout from "~/components/PopupLogout/PopupLogout"
import adminRoutes from "~/routes/adminRoutes"

function App() {

	const user = useSelector(state => state.user.value)

	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Auth Routes */}
					{authRoutes.map((route, index) => {
                        const Page = route.component
                        const Layout = route.layout || NoLayout

                        if ((user.data.role) === 'Admin') {
                            return (
                                <Route key={index} path={route.path} element={
                                    !user.exists ? (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Navigate to="/dashboard" replace />
                                    )
                                } />
                            )
                        }

                        if ((user.data.role) === 'TechnicalStaff') {
                            return (
                                <Route key={index} path={route.path} element={
                                    !user.exists ? (
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    ) : (
                                        <Navigate to="/task" replace />
                                    )
                                } />
                            )
                        }

                        return (
                            <Route key={index} path={route.path} element={
                                !user.exists ? (
                                    <Layout>
                                        <Page />
                                    </Layout>
                                ) : (
                                    <Navigate to="/schedule" replace />
                                )
                            } />
                        )
                    })}

					{/* Protected routes */}
					{protectedRoutes.map((route, index) => {
						const Page = route.component
						const Layout = route.layout || NoLayout
						// If the user is not logged in, redirect to the login page
						if (!user.exists) {
							return (
								<Route
									key={index}
									path={route.path}
									element={<Navigate to="/auth/login" replace />}
								/>
							)
						}
						// If the user is logged in but doesn't have the required role for the route, redirect to the home page
						if (!route.roles.includes(user.data.role)) {
							if ((user.data.role) === 'Admin') {
								return (
									<Route key={index} path={route.path} element={
										!user.exists ? (
											<Layout>
												<Page />
											</Layout>
										) : (
											<Navigate to="/dashboard" replace />
										)
									} />
								)
							}
	
							if ((user.data.role) === 'TechnicalStaff') {
								return (
									<Route key={index} path={route.path} element={
										!user.exists ? (
											<Layout>
												<Page />
											</Layout>
										) : (
											<Navigate to="/task" replace />
										)
									} />
								)
							}
	
							return (
								<Route key={index} path={route.path} element={
									!user.exists ? (
										<Layout>
											<Page />
										</Layout>
									) : (
										<Navigate to="/schedule" replace />
									)
								} />
							)
						}
						// If both conditions are met, show the route's page with the appropriate layout
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						)
					})}

					{/* Admin Routes */}
					{adminRoutes.map((route, index) => {
						const Page = route.component
						const Layout = route.layout || NoLayout

						if (user.data.role === "Admin") {
							return (
                                <Route key={index} path={route.path} element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                } />
                            )
						} else {
							if ((user.data.role) === 'TechnicalStaff') {
								return (
									<Route key={index} path={route.path} element={
										!user.exists ? (
											<Layout>
												<Page />
											</Layout>
										) : (
											<Navigate to="/task" replace />
										)
									} />
								)
							}
	
							return (
								<Route key={index} path={route.path} element={
									!user.exists ? (
										<Layout>
											<Page />
										</Layout>
									) : (
										<Navigate to="/schedule" replace />
									)
								} />
							)
						}
					})}

					{/* Routes not found */}
					<Route path="*" element={
						<Navigate to="/auth/login" replace />
					} />
				</Routes>

				{/* Components */}
				<Popup />
				<PopupLogout />

			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
