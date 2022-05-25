import Container from 'react-bootstrap/Container';
import React, {useState} from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

const UserId = 3 //Statinsi userio ID kuri veliau keisime


export default ProfileCreate => {

    const navigate = useNavigate()

    const [profileForm, setProfileForm] = useState({
        headline:'',
        subheadline:'',
        description:'',
        hourly_rate:'5',
        location:''
    })
    const [messages, setMessages] = useState({message: '', status: ''})

    const handleInputChange = (e) => {
        setProfileForm({
            ...profileForm, [e.target.name]:e.target.value
        })
    }

    const handleValidation = () => {
        for(let index of Object.keys(profileForm)) {
            if(index === 'hourly_rate' && profileForm[index] < 0 ) {
                return false
            }
            if(profileForm[index] === '') {
                return false
            }
        }

        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(profileForm)
        if(!handleValidation()) {
            setMessages({message: 'Netinkamai užpildyta forma', status: 'danger'})
            return false
        }

        profileForm.UserId = UserId

        axios.post('/api/profiles/create', profileForm)
        .then(resp => {
            setMessages({message: resp.data.message, status: resp.data.status})
            if(resp.data.status === 'success') {
                setTimeout(() => {
                navigate('/')  
                }, 3000)
            }
        })
        .catch(() => {
            setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
        })
    }


    return(
        <Container>
        <div className="profileCreate">
        {messages.message && (
                <Alert variation={messages.status}>{messages.message}</Alert>
            )}
        <h1>Profilio kūrimas</h1> 
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className="form-label">Antraštė</label>
            <input type="text" name="headline" className="form-control" placeholder="Nuostabus programuotojas" value={profileForm.headline} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
            <label className="form-label">Poraštė</label>
            <input type="text" name="subheadline" className="form-control" placeholder="Dešimt metų darbo praktikos" value={profileForm.subheadline} onChange={handleInputChange}/>
        </div>
        <div className="mb-3">
            <label className="form-label">Prisistatymas</label>
            <textarea className="form-control" rows="3" name="description" value={profileForm.description} onChange={handleInputChange}></textarea>
        </div>
        <div className="mb-3">
            <label className="form-label">Valandinis įkainis</label>
            <input type="number" name="hourly_rate" className="form-control" value={profileForm.hourly_rate} min="0" onChange={handleInputChange}/>
        </div>
        <div className="mb-3">
            <label className="form-label">Vieta</label>
            <input type="text" name="location" className="form-control" placeholder="Kaunas, Lietuva" value={profileForm.location} onChange={handleInputChange} />
        </div>
        <Button type='submit' variant='primary'>Kurti profilį</Button>
        </form>
    </div>
    </Container>
    )
}