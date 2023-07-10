import React, { useState } from 'react';
import styles from './form.module.css';
import { ModalConfirm, ToastError, ModalSuccess, Inputs, Button } from 'Components/Shared';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { createAdmin, updateAdmin } from 'redux/admins/thunks';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

const FormAdmin = () => {
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [toastErroOpen, setToastErroOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Error in database');
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const data = location.state.params;
  const dispatch = useDispatch();

  const schema = Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    dni: Joi.number().min(10000000).max(99999999).required(),
    phone: Joi.string().min(9).max(12).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    city: Joi.string().min(2).max(10).required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      .message('The password must have at least one Uppercase,a number and 8 characters.'),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': "Passwords don't match"
    })
  });

  const adminUpdated = {
    firstName: data.firstName,
    lastName: data.lastName,
    dni: data.dni,
    phone: data.phone,
    email: data.email,
    city: data.city,
    password: data.password,
    repeatPassword: data.password
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: joiResolver(schema),
    defaultValues: {
      ...adminUpdated
    }
  });

  const addAdmins = async () => {
    try {
      createAdmin(dispatch, inputValue);
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
      updateAdmin(dispatch, id, inputValue);
      if (!data.error) {
        confirmation();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setToastMessage(error.message);
      setToastErroOpen(true);
    }
  };

  const openModal = () => {
    setModalConfirmOpen(true);
  };

  const confirmation = () => {
    setModalSuccessOpen(true);
    setTimeout(() => {
      history.push('/superAdmin/admin');
    }, 2000);
  };

  const submitAdmin = () => {
    if (!id) {
      setModalConfirmOpen(false);
      addAdmins();
    } else {
      setModalConfirmOpen(false);
      addEditAdmins();
    }
  };

  const onSubmit = async (dataAdmin) => {
    const newAdmin = {
      firstName: dataAdmin.firstName,
      lastName: dataAdmin.lastName,
      dni: dataAdmin.dni,
      phone: dataAdmin.phone,
      email: dataAdmin.email,
      city: dataAdmin.city,
      password: dataAdmin.password
    };
    setInputValue(newAdmin);
    openModal();
  };

  return (
    <div className={styles.containerForm}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <div className={styles.groupContainer}>
            <Inputs
              nameTitle="Name"
              register={register}
              nameInput="firstName"
              type="text"
              isDisabled={false}
              error={errors.firstName?.message}
              testId="input-admin-name"
            />
            <Inputs
              nameTitle="LastName"
              register={register}
              nameInput="lastName"
              type="text"
              isDisabled={false}
              error={errors.lastName?.message}
              testId="input-admin-lastname"
            />
            <Inputs
              nameTitle="DNI"
              register={register}
              nameInput="dni"
              type="text"
              isDisabled={false}
              error={errors.dni?.message}
              testId="input-admin-dni"
            />
            <Inputs
              nameTitle="Phone"
              register={register}
              nameInput="phone"
              type="text"
              isDisabled={false}
              error={errors.phone?.message}
              testId="input-admin-phone"
            />
          </div>
          <div className={styles.groupContainer}>
            <Inputs
              nameTitle="E-Mail"
              register={register}
              nameInput="email"
              type="email"
              isDisabled={false}
              error={errors.email?.message}
              testId="input-admin-email"
            />
            <Inputs
              nameTitle="City"
              register={register}
              nameInput="city"
              type="text"
              isDisabled={false}
              error={errors.city?.message}
              testId="input-admin-city"
            />
            <Inputs
              nameTitle="Password"
              register={register}
              nameInput="password"
              type="password"
              isDisabled={false}
              error={errors.password?.message}
              testId="input-admin-password"
            />
            <Inputs
              nameTitle="Repeat Password"
              register={register}
              nameInput="repeatPassword"
              type="password"
              isDisabled={false}
              error={errors.repeatPassword?.message}
              testId="input-admin-repeat-password"
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button text="reset" clickAction={() => reset()} testId="admin-reset-btn" />
          <Button text="Save" clickAction={() => {}} testId="admin-save-btn" />
          <Button
            clickAction={(e) => {
              e.preventDefault();
              history.goBack();
            }}
            text="Cancel"
            testId="admin-cancel-btn"
          />
        </div>
      </form>

      {modalConfirmOpen && (
        <ModalConfirm
          method={id ? 'Edit' : 'Create'}
          message={
            id
              ? 'Are you sure you want to update this admin?'
              : 'Are you sure you want to add this admin?'
          }
          onConfirm={submitAdmin}
          setModalConfirmOpen={setModalConfirmOpen}
          testId="admin-modal-confirm"
        />
      )}
      {modalSuccessOpen && (
        <ModalSuccess
          message={
            id ? 'Admin has been updated succesfully' : 'Admin has been created successfully'
          }
          setModalSuccessOpen={setModalSuccessOpen}
          testId="admin-modal-success"
        />
      )}
      {toastErroOpen && (
        <ToastError
          setToastErroOpen={setToastErroOpen}
          message={toastMessage}
          testId="admin-form-toast-error"
        />
      )}
    </div>
  );
};

export default FormAdmin;
