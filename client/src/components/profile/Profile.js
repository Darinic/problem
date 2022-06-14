import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState({});
  const [isEmpty, setIsEmpty] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/profiles/single/" + id)
      .then((resp) => {
          console.log(resp)
        setIsLoading(false);

        if (resp.data.status === "success") {
          setProfile(resp.data.message);
        }else {
            setIsEmpty(true)
        }
      })
      .catch(() => {
        setIsLoading(false);
        // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
      });
  }, []);

  const ProfileWrapper = () => {

    if(isEmpty)
    return <Navigate to="/" />

    const imageExists = profile.profile_image != null
      return(
    <Container>
        <div className="profile">
            {imageExists ? (
      <img src={"/" + profile.profile_image} alt={profile.headline} />
      ): ''}
      <h1>{profile.headline}</h1>
      <h2>{profile.subheadline}</h2>
      <p>{profile.description}</p>
      <div>
        <strong>Valandinis įkainis: {profile.hourly_rate} </strong>
      </div>
      <p>Vietovė: {profile.location}</p>
      <ProfilePortfolio />
      </div>
    </Container>
      )
  };

  const ProfilePortfolio = () => {
      return profile.portfolio ? (
          <div className="grid">
              {profile.portfolio.map(image => (
                  <div key={image.id} className="g-col-4">
                      <img src={'/' + image.image_url} />
                  </div>
              ))}
          </div>
      ) : ''
  }

  return isLoading ? <div>Kraunasi...</div> : <ProfileWrapper />;
};

export default Profile;
