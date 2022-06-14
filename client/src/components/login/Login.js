import React from 'react'
import { useState } from 'react'
import './Login.css'
import Alert  from 'react-bootstrap/Alert'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default (props) => {

    const navigate = useNavigate()

    const [loginForm, setLoginForm] = useState({
        email:'',
        password:''
    })
    const [messages, setMessages] = useState({message: '', status: ''})

    const handleInputChange = (e) => {
        setLoginForm({
            ...loginForm, [e.target.name]:e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!handleValidation()) {
            setMessages({message: 'Netinkamai užpildyta forma', status: 'danger'})
            return false
        }

        axios.post('/api/users/login', loginForm)
        .then(resp => {
            setMessages({message: resp.data.message, status: resp.data.status})
            if(resp.data.status === 'success') {
                props.state(true)
                setTimeout(() => {
                navigate('/')  
                }, 3000)
            }
        })
        .catch(() => {
            setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }

    const handleValidation = () => {
        for(let index of Object.keys(loginForm)) {
            if(loginForm[index] === '') {
                return false
            }
        }

        return true
    }
    return (
        <div className='text-center'>
        <main className="form-signin w-100 m-auto">
            {messages.message && (
                <Alert variation={messages.status}>{messages.message}</Alert>
            )}
            <form onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 fw-normal">Prisijungimas</h1>
                <div className="form-floating">
                    <input type="email" className="form-control" name="email" value={loginForm.email} onChange={handleInputChange}/>
                    <label>El. pašto adresas</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" name="password" value={loginForm.password} onChange={handleInputChange}/>
                    <label>Slaptažodis</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Prisijungti</button>
            </form>
        </main>
        </div>
    )
}