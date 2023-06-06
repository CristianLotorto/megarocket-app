import React, { useEffect, useState } from 'react';
import styles from './form.module.css';
import { ModalConfirm, ToastError, ModalSuccess } from '../../Shared';
import { useParams, useLocation, useHistory } from 'react-router-dom';

const FormAdmin = () => {
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    dni: '',
    password: ''
  });
  const [repeatPass, setRepeatPass] = useState('');
  const [toastErroOpen, setToastErroOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Error in database');
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);

  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const data = location.state.params;

  useEffect(() => {
    if (data.mode === 'create') {
      setInputValue({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: '',
        dni: '',
        password: ''
      });
    } else {
      setInputValue({
        firstName: data.item.firstName,
        lastName: data.item.lastName,
        phone: data.item.phone,
        email: data.item.email,
        city: data.item.city,
        dni: data.item.dni,
        password: data.item.password
      });
      setRepeatPass(data.item.password);
      setEditMode(true);
    }
  }, []);

  const addAdmins = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/api/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputValue)
      });
      const data = await resp.json();
      if (!data.error) {
        confirmation();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalConfirmOpen(false);
      setToastErroOpen(true);
      setToastMessage(error.message);
    }
  };

  const addEditAdmins = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/api/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputValue)
      });
      const data = await resp.json();
      if (!data.error) {
        confirmation();
        setModalSuccessOpen(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setToastMessage(error.message);
      setToastErroOpen(true);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    setModalConfirmOpen(true);
  };

  const validatePasswords = () => {
    if (inputValue.password === repeatPass) {
      return true;
    } else {
      return false;
    }
  };

  const confirmation = () => {
    setModalSuccessOpen(true);
    setTimeout(() => {
      history.push('/admins/');
    }, 2000);
  };

  const submitAdmin = () => {
    if (validatePasswords()) {
      if (!editMode) {
        setModalConfirmOpen(false);
        addAdmins();
      } else {
        setModalConfirmOpen(false);
        addEditAdmins();
      }
    } else {
      setModalConfirmOpen(false);
      setToastErroOpen(true);
      setToastMessage('Passwords must match ');
    }
  };

  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };
  const handleRepeatPasswordChange = (e) => {
    const { value } = e.target;
    setRepeatPass(value);
  };

  return (
    <div className={styles.containerForm}>
      <form className={styles.form}>
        <div className={styles.subContainer}>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              name="firstName"
              type="text"
              value={inputValue.firstName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Last Name</label>
            <input
              className={styles.input}
              name="lastName"
              type="text"
              value={inputValue.lastName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>DNI</label>

            <input
              className={styles.input}
              name="dni"
              type="text"
              value={inputValue.dni}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              name="phone"
              type="text"
              value={inputValue.phone}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              name="email"
              type="text"
              value={inputValue.email}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>City</label>

            <input
              className={styles.input}
              name="city"
              type="text"
              value={inputValue.city}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              name="password"
              type="password"
              value={inputValue.password}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.label}>Repeat Password</label>
            <input
              className={styles.input}
              name="repeatPassword"
              type="password"
              required
              value={repeatPass}
              onChange={handleRepeatPasswordChange}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={openModal}>
            Save
          </button>
          <button
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              history.push('/admins/');
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      {modalConfirmOpen && (
        <ModalConfirm
          method={editMode ? 'Edit' : 'Create'}
          message={
            editMode
              ? 'Are you sure you want to edit the admin?'
              : 'Are you sure you want to add the admin?'
          }
          onConfirm={submitAdmin}
          setModalConfirmOpen={setModalConfirmOpen}
        />
      )}
      {modalSuccessOpen && (
        <ModalSuccess
          message={editMode ? 'Admin edited successfully' : 'Admin created successfully'}
          setModalSuccessOpen={setModalSuccessOpen}
        />
      )}
      {toastErroOpen && <ToastError setToastErroOpen={setToastErroOpen} message={toastMessage} />}
    </div>
  );
};

export default FormAdmin;
