
import { useState } from 'react';

const API_URL = 'http://localhost:3001/api/auth';

export default function Login() {
  const [showSignup, setShowSignup] = useState(
    window.location.pathname.replace(/\/+$/, '') === '/signup' ||
    new URLSearchParams(window.location.search).get('form') === 'signup'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchForm(signup) {
    setShowSignup(signup);
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
    setError('');

    window.history.replaceState(
      {},
      '',
      signup ? '/signup' : '/login'
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    const endpoint = showSignup ? '/signup' : '/login';

    const payload = showSignup
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      // Keep the login session for this browser tab.
      sessionStorage.setItem('kumaritesToken', data.token);
      sessionStorage.setItem(
        'kumaritesUser',
        JSON.stringify(data.user)
      );

      setMessage(
        showSignup
          ? 'Account created successfully! You are now logged in.'
          : 'Login successful!'
      );

      setPassword('');
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please try again.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      {/* Left Side: Welcome Panel */}
      <section className="welcome-section">
        <div className="logo">
          <a href="/">
            <img
              src="/Images/BuzzFeed%20Images/Kumarites%20Logo.png"
              alt="Kumarites"
            />
          </a>

          <h5>Real Finds. Real People. A More Sulit You.</h5>
          <br />

          <p>
            <em>
              Discover sulit finds, share recommendations, and connect
              with your community.
            </em>
          </p>
        </div>
      </section>

      {/* Right Side: Login and Signup Forms */}
      <section className="form-section">
        {!showSignup ? (
          <div className="form-container" id="loginForm">
            <h2>Welcome Back!</h2>

            <p className="form-subtitle">
              Log in to your Kumarites account
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              {error && <p role="alert">{error}</p>}
              {message && <p role="status">{message}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="switch-form">
              Don't have an account?{' '}
              <a
                href="/login?form=signup"
                onClick={(event) => {
                  event.preventDefault();
                  switchForm(true);
                }}
              >
                Sign Up
              </a>
            </p>
          </div>
        ) : (
          <div className="form-container" id="signupForm">
            <h2>Create an Account</h2>

            <p className="form-subtitle">
              Join the Kumarites community
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />

              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />

              <label htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                placeholder="Create a password (at least 8 characters)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
              />

              {error && <p role="alert">{error}</p>}
              {message && <p role="status">{message}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="switch-form">
              Already have an account?{' '}
              <a
                href="/login"
                onClick={(event) => {
                  event.preventDefault();
                  switchForm(false);
                }}
              >
                Log In
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}