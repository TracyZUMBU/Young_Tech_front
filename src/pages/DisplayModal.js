import React, {useState} from "react";
import Modal from "react-modal";
//components
import Button from "../components/Button";

Modal.setAppElement("#root");

const DisplayModal = (props) => {
  console.log('props:', props)


  const [modalIsOpen, setmodalIsOpen] = useState(false);
  //handle modal opening
  const handleModale = () => {
    setmodalIsOpen(true);
  };

  const onSubmit = async (values) => {
    delete values["repeat_password"];
    //remove empty string from the objects "values" in order to add into the BDD only values' fields provided
    Object.keys(values).forEach(
      (key) => values[key] === "" && delete values[key]
    );
    const url = `http://localhost:4040/allpeople/updateProfile/${userID}`;
    await axios({
      method: "PUT",
      url: url,
      data: values,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    })
      .then((res) => {
        setResponse(res);
      })

      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
    <div className="othersOptions">
        <Button
          action={() => handleModale()}
          className={"btn btn--round btn--grey"}
          value={props.value}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        shouldCloseOnOverLayClick={false}
      >
        <div>
          <h2>confirmer {props.typeAction} ?</h2>
          <button onClick={()=> onSubmit()}>Oui</button>
        </div>
      </Modal>
    </>
  );
};

export default DisplayModal
