import { useState } from 'react';
export default function Login() {
  const [showSignup, setShowSignup] = useState(
    window.location.pathname.replace(/\/+$/, '') === '/signup' ||
    new URLSearchParams(window.location.search).get('form') === 'signup'
  );

  function switchForm(signup) {
    setShowSignup(signup);

    const url = signup ? '/signup' : '/login';
    window.history.replaceState({}, '', url);
  }

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      showSignup
        ? 'Signup form submitted. Account creation is not connected yet.'
        : 'Login form submitted. Authentication is not connected yet.'
    );
  }

  return (
    <>
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

          <h2>Real Finds. Real People. A More Sulit You.</h2>
          <br />

          <p>
            <em>
              Discover sulit finds, share recommendations, <br />
              and connect with your community.
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
                required
              />

              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                placeholder="Enter your password"
                required
              />

              <button type="submit">Log In</button>
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
                required
              />

              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="signupPassword">Password</label>
              <input
                type="password"
                id="signupPassword"
                placeholder="Create a password"
                required
              />

              <button type="submit">Sign Up</button>
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
    </>
  );
}