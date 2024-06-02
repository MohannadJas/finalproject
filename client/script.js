class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            registerUsername: '',
            registerPassword: '',
            loginUsername: '',
            loginPassword: '',
            num1: '',
            num2: '',
            result: null,
            savedResults: [],
            error: '',
            username: '',
            isRegisterView: false,
            view: 'menu'  // 'menu', 'calculate', 'results'
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    toggleView = () => {
        this.setState(prevState => ({
            isRegisterView: !prevState.isRegisterView,
            error: ''
        }));
    }

    handleRegister = () => {
        const { registerUsername, registerPassword } = this.state;
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: registerUsername, password: registerPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('User registered successfully!');
                this.setState({ registerUsername: '', registerPassword: '', error: '', isRegisterView: false });
            } else {
                this.setState({ error: data.message });
            }
        });
    }

    handleLogin = () => {
        const { loginUsername, loginPassword } = this.state;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({
                    isLoggedIn: true,
                    savedResults: data.results,
                    error: '',
                    loginUsername: '',
                    loginPassword: '',
                    username: loginUsername
                });
            } else {
                this.setState({ error: data.message });
            }
        });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, result: null, savedResults: [], username: '' });
    }

    handleCalculation = (operation) => {
        const { num1, num2 } = this.state;
        let result;
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);

        if (isNaN(n1) || isNaN(n2)) {
            this.setState({ error: 'Please enter valid numbers' });
            return;
        }

        switch (operation) {
            case 'add':
                result = n1 + n2;
                break;
            case 'subtract':
                result = n1 - n2;
                break;
            case 'multiply':
                result = n1 * n2;
                break;
            case 'divide':
                result = n1 / n2;
                break;
            default:
                result = null;
        }

        this.setState({ result, error: '' });
    }

    handleSaveResult = () => {
        const { result, username } = this.state;
        fetch('/save-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, result })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState(prevState => ({
                    savedResults: [...prevState.savedResults, prevState.result]
                }));
            } else {
                this.setState({ error: data.message });
            }
        });
    }

    setView = (view) => {
        this.setState({ view });
    }

    render() {
        const {
            isLoggedIn, registerUsername, registerPassword,
            loginUsername, loginPassword, num1, num2, result, savedResults, error, isRegisterView, view
        } = this.state;

        if (isLoggedIn) {
            if (view === 'menu') {
                return (
                    <div className="container">
                        <h2>Welcome, {this.state.username}</h2>
                        <div className="menu">
                            <button onClick={() => this.setView('calculate')}>Calculate</button>
                            <button onClick={() => this.setView('results')}>Previous Results</button>
                            <button onClick={this.handleLogout}>Logout</button>
                        </div>
                    </div>
                );
            } else if (view === 'calculate') {
                return (
                    <div className="container">
                        <h2>Calculation</h2>
                        <input
                            type="text"
                            name="num1"
                            placeholder="Enter first number"
                            value={num1}
                            onChange={this.handleInputChange}
                        />
                        <input
                            type="text"
                            name="num2"
                            placeholder="Enter second number"
                            value={num2}
                            onChange={this.handleInputChange}
                        />
                        <div>
                            <button onClick={() => this.handleCalculation('add')}>Add</button>
                            <button onClick={() => this.handleCalculation('subtract')}>Subtract</button>
                            <button onClick={() => this.handleCalculation('multiply')}>Multiply</button>
                            <button onClick={() => this.handleCalculation('divide')}>Divide</button>
                        </div>
                        {result !== null && (
                            <div>
                                <p>Result: {result}</p>
                                <button onClick={this.handleSaveResult}>Save Result</button>
                            </div>
                        )}
                        <button className="switch-button" onClick={() => this.setView('menu')}>Back to Menu</button>
                    </div>
                );
            } else if (view === 'results') {
                return (
                    <div className="container">
                        <h2>Saved Results</h2>
                        <ul>
                            {savedResults.map((result, index) => (
                                <li key={index}>{result}</li>
                            ))}
                        </ul>
                        <button className="switch-button" onClick={() => this.setView('menu')}>Back to Menu</button>
                    </div>
                );
            }
        }

        return (
            <div className="container">
                {error && <p className="error">{error}</p>}
                <div className={!isRegisterView ? '' : 'hidden'}>
                    <h2>Login</h2>
                    <input
                        type="text"
                        name="loginUsername"
                        placeholder="Username"
                        value={loginUsername}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="password"
                        name="loginPassword"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleLogin}>Login</button>
                    <button className="switch-button" onClick={this.toggleView}>Register</button>
                </div>
                <div className={isRegisterView ? '' : 'hidden'}>
                    <h2>Register</h2>
                    <input
                        type="text"
                        name="registerUsername"
                        placeholder="Username"
                        value={registerUsername}
                        onChange={this.handleInputChange}
                    />
                    <input
                        type="password"
                        name="registerPassword"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={this.handleInputChange}
                    />
                    <button onClick={this.handleRegister}>Register</button>
                    <button className="switch-button" onClick={this.toggleView}>Login</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
