import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import ProfileBox from "../profile-box/ProfileBox";

export default () => {
  const [profiles, setProfiles] = useState([]);
  const [filter, setFilter] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/profiles/")
      .then((resp) => {
        setIsLoading(false);

        if (resp.data.status === "success") {
          setProfiles(resp.data.message);
        }
      })
      .catch(() => {
        setIsLoading(false);
        // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
      });
  }, []);

  const sortDescending = () => {
    axios
      .get("/api/profiles/sort/desc")
      .then((resp) => {
        setIsLoading(false);

        if (resp.data.status === "success") {
          setProfiles(resp.data.message);
        }
      })
      .catch(() => {
        setIsLoading(false);
        // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
      });
  };


  
  const sortAscending = () => {
    axios
      .get("/api/profiles/sort/asc")
      .then((resp) => {
        setIsLoading(false);

        if (resp.data.status === "success") {
          setProfiles(resp.data.message);
        }
      })
      .catch(() => {
        setIsLoading(false);
        // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
      });
  };


  const List = () => {
    return profiles.map((value, index) => (
    <ProfileBox key={index} profile={value} />
    ));
  };

  const ListContainer = () => {
    return (
      <div className="row row-cols-1 row-cols-sm2 row-cols-md-3 g-3 pt-5">
        <List />
      </div>
    );
  };

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const handleFilterSubmit= () => {
    setIsLoading(true)
    axios
      .get("/api/profiles/filter/hourly_rate/" + filter)
      .then((resp) => {
        setIsLoading(false);

        if (resp.data.status === "success") {
          setProfiles(resp.data.message);
        }
      })
      .catch(() => {
        setIsLoading(false);
        // setMessages({message: 'Įvyko serverio klaida', status: 'danger'})
      });
  }


  return (
    <Container>
      <h1>Freelancerių sąrašas</h1>
      {isLoading ? "Duomenys kraunasi..." : (
        <>
    <div className="Filter">
      <label>Filtravimas pagal valadinį įkainį</label>
    <input type="number" min="0" value={filter} onChange={handleFilter} />
    <button onClick={handleFilterSubmit}>Filtruoti</button>
    </div>
    <div className="sorting">
      <button className="btn btn-primary" onClick={sortAscending}>Didėjančia tvarka</button>
      <button className="btn btn-primary" onClick={sortDescending}>Mažėjančia tvarka</button>
    </div>
      <ListContainer />
      </>
    )}
    </Container>
  );
};
