import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import decode from "jwt-decode";

import { UserInfoContext } from "../App";

//components
import FormikControl from "../components/formik/FormikControl";
import Hero from "../components/Hero";
import Button from "../components/Button";

//const getUserDetails = require("../../src/services/services");
import { userDetails, getUserDetails } from "../../src/services/services";
const ApplicationForm = (props) => {
  let history = useHistory();
  const { offer_id, compagny_id } = props.match.params;

  // get user'id from localstorage
  const token = localStorage.getItem("token");
  const userID = userDetails.userID;

  //store user's details
  const [myDetails, setMyDetails] = useState([]);


  useEffect(() => {
    if (userID) {
      async function fetchData() {
        const userDetails = await getUserDetails.getUserDetails(userID);
        setMyDetails(userDetails);
      }
      fetchData();
    }
  }, [userID]);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    cover_letter: "",
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("Obligatoire !"),
    last_name: Yup.string().required("Obligatoire !"),
    phone: Yup.string().required("Obligatoire !"),
    cover_letter: Yup.string().required("Obligatoire !"),
    email: Yup.string()
      .email("Le format de l'email est incorrect !")
      .required("Obligatoire !"),
  });

  const onSubmit = async (values) => {
    console.log("values:", values);
    try {
      const url = "http://localhost:4040/users/postApplication";
      await axios({
        method: "POST",
        url: url,
        data: {
          ...values,
          user_id: userID,
          offer_id,
          compagny_id,
        },
      }).then((res) => {
        if (res.status === 200) {
          alert("Votre candidature a été envoyée");
          window.location.replace("/");
        }
      });
    } catch {
      alert("Votre candidature n'a pas pu être envoyée");
    }

  };

  return (
    <div className="applicationForm">
      <Hero title="Postuler" subtitle={""} />
      <div className="form-box">
        {!myDetails.phone ? null : (
          <Formik
            initialValues={myDetails || ""}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnMount
          >
            {(formik) => (
              <Form className="createAd-form">
                <div className="createAd-form__inner">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Prénom"
                    name="first_name"
                    placeholder="Anne"
                    value={myDetails.first_name}
                  />
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nom"
                    name="last_name"
                    placeholder="Dupont"
                    value={myDetails.last_name}
                  />
                  <FormikControl
                    control="input"
                    type="email"
                    label="E-mail"
                    name="email"
                    placeholder="annedupont@domaine.com"
                  />
                  <FormikControl
                    control="input"
                    type="phone"
                    label="Téléphone"
                    name="phone"
                    placeholder="Anne"
                  />
                  <FormikControl
                    control="textarea"
                    label="Lettre de motivation"
                    name="cover_letter"
                    placeholder="pourquoi souhaitez-vous nous rejoindre"
                  />
                  <Button
                    type="submit"
                    disabled={!formik.isValid}
                    className={"btn"}
                    value={"Postuler"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        )}

        {!userID ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnMount
          >
            {(formik) => (
              <Form className="createAd-form">
                <div className="createAd-form__inner">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Prénom"
                    name="first_name"
                    placeholder="Anne"
                  />
                  <FormikControl
                    control="input"
                    type="text"
                    label="Nom"
                    name="last_name"
                    placeholder="Dupont"
                  />
                  <FormikControl
                    control="input"
                    type="email"
                    label="E-mail"
                    name="email"
                    placeholder="annedupont@domaine.com"
                  />
                  <FormikControl
                    control="input"
                    type="phone"
                    label="Téléphone"
                    name="phone"
                    placeholder="Anne"
                  />
                  <FormikControl
                    control="textarea"
                    label="Lettre de motivation"
                    name="cover_letter"
                    placeholder="pourquoi souhaitez-vous nous rejoindre"
                  />
                  <Button
                    type="submit"
                    disabled={!formik.isValid}
                    className={"btn"}
                    value={"Postuler"}
                  />
                </div>
              </Form>
            )}
          </Formik>
        ) : null}
      </div>
    </div>
  );
};

export default ApplicationForm;
