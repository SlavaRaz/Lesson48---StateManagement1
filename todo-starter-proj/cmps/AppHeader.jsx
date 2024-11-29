const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux


import { userService } from '../services/user.service.js'
import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'


export function AppHeader() {
    const todos = useSelector((storeState) => storeState.todoModule.todos)
    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const doneTodosPercent = useSelector((storeState) => storeState.todoModule.doneTodosPercent)

    // const [user, setUser] = useState(userService.getLoggedinUser())

    function onLogout() {
        logout()
            .then(() => {
                showErrorMsg('Logout succesfully')
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

   
    function getStyleByUser() {
        const prefs = {
            color: '',
            backgroundColor: ''
        }

        if (user && user.pref) {
            prefs.color = user.pref.color
            prefs.backgroundColor = user.pref.bgColor
        }

        return prefs
    }

    const formattedPercent = todos ? doneTodosPercent.toFixed(2) + '%' : null

    return (
        <header style={getStyleByUser()} className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section className="flex space-between align-center container">
                        <div>
                            <Link to={`/user`}>Hello {user.fullname}</Link>
                            <p>Your balance is {user.balance}</p>
                            <button onClick={onLogout}>Logout</button>
                        </div>
                        {todos &&
                            <section className="todos-progress">
                                <h3>you have finished {formattedPercent}</h3>
                                <div className="progress-bar-container" >
                                    <span>{formattedPercent}</span>
                                    <div style={{ width: formattedPercent }}>

                                    </div>
                                </div>
                            </section>
                        }
                    </ section >
                ) : (
                    <section>
                        <LoginSignup />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                    <NavLink to="/user" >User profile</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}