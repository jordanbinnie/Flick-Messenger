import Head from 'next/head'
import LoginBox from '../components/login-box/LoginBox'

function Login() {

    return (
        <div className="LoginPage">
            <Head>
                <title>Login</title>
            </Head>
            <LoginBox />
        </div>
            
    )
}

export default Login

