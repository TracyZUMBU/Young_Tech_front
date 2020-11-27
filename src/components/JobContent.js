import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-modal";
//components
import Button from "../components/Button";

import { userDetails } from "../services/services"

const JobContent = (props) => {
  const {
    idJob,
    compagny_id,
    description_compagny,
    description_position,
    prerequisite,
    userType,
  } = props;

  // get user'id from localstorage
  const token = localStorage.getItem("token");
  const userID = userDetails.userID

  //handle the modal and the response from the back when deleting something
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [response, setResponse] = useState([]);

  //handle opening modale
  const handleModale = () => {
    setmodalIsOpen(true);
  };

  //close the modal and delete the offer
  const handleDeleteOffer = async () => {
    setmodalIsOpen(false);
    switch (userType) {
      case "compagny":
        try {
          const urlAdmin = `http://localhost:4040/compagny/deleteOffer/${idJob}`;
          await axios({
            method: "DELETE",
            url: urlAdmin,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }).then((res) => setResponse(res.data));
        } catch {
          alert("L'offre n'a pas pu être supprimé");
        }
        break;
      case "admin":
        try {
          const urlAdmin = `http://localhost:4040/compagny/deleteOffer/${idJob}`;
          await axios({
            method: "DELETE",
            url: urlAdmin,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }).then((res) => setResponse(res.data));
        } catch {
          alert("L'offre n'a pas pu être supprimé");
        }
        break;
      case "user":
        try {
          const urlUser = `http://localhost:4040/users/deleteApplication/${userID}/${idJob}`;
          await axios({
            method: "DELETE",
            url: urlUser,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }).then((res) => {
            if (res.status === 200) {
              alert("Votre candidature a été supprimer");
              window.location.reload()
            }
          });
        } catch {
          alert("Votre candidature n'a pas pu être supprimer");
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="jobPage__content">
        <div className="jobPage__description">
          <h6>Description de l'entreprise</h6>
          <p>{description_compagny}</p>
          <h6>Description du poste</h6>
          <p>{description_position}</p>
        </div>
        <div className="jobPage__prerequisite">
          <h6>Pré-requis</h6>
          <p>{prerequisite}</p>
        </div>
        <div className="side-bar">
          <div className="widget">
            <div className="inner">
              {/* element available from homepage */}
              {userType ? null : (
                <Button className={"btn btn--grey"} value={"Sauvegarder"} />
              )}
              {userType ? null : (
                <Link to={`/apply/${idJob}/${compagny_id}`} className="btn">
                  Postuler
                </Link>
              )}

              {/* element available from compagnyProfile and/or adminProfile */}
              {userType === "compagny" || userType === "admin" ? (
                <Link
                  to={{
                    pathname: `/updatead/${idJob}`,
                    state: { compagny_id: true },
                  }}
                  className="btn btn--grey"
                >
                  Editer
                </Link>
              ) : null}
              {userType === "compagny" || userType === "admin" ? (
                <Button
                  action={handleModale}
                  value={"Supprimer"}
                  className="btn"
                />
              ) : null}

              {/* element available for user only */}
              {userType === "user" ? (
                <Button
                  value={"Retirer sa candidature"}
                  className="btn btn-round"
                  action={handleModale}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        shouldCloseOnOverLayClick={false}
      >
        <div>
          <h2>confirmer la suppression ?</h2>
          <button onClick={() => handleDeleteOffer()}>Oui</button>
        </div>
      </Modal>
    </>
  );
};

export default JobContent;
