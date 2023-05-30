import { useEffect, useState } from 'react';
import styles from './members.module.css';
import TableMember from './TableMember';
import ModalConfirm from '../Modals/ModalConfirm/index';
import ModalSuccess from '../Modals/ModalSuccess/index';

function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setEditForm] = useState(false);
  const [modalSuccessOpen, setModalSuccessOpen] = useState(false);
  const [modalEditConfirmOpen, setModalEditConfirmOpen] = useState(false);

  const getMembers = async () => {
    try {
      const reponse = await fetch(`${process.env.REACT_APP_API_URL}/member`);
      const data = await reponse.json();
      setMembers(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMembers();
  }, []);

  const updateMember = async (id, memberUpdated) => {
    let memberToUpdateIndex = members.findIndex((member) => member.id === id);
    console.log(id);
    console.log(memberUpdated);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + `/member/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(memberUpdated)
      });

      const { error, data } = await response.json();
      if (!error) {
        const currentsMembers = [...members];
        currentsMembers[memberToUpdateIndex] = data;
        setMembers(currentsMembers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const memberDelete = async (memberId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/member/${memberId}`, {
        method: 'DELETE'
      });
      console.log(response);
      setMembers([...members.filter((member) => member._id !== memberId)]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    setShowForm((current) => !current);
    setEditForm(false);
  };

  const handleEditToggle = () => {
    setEditForm((current) => !current);
    setShowForm(false);
  };

  return (
    <section className={styles.container}>
      <div>
        {modalEditConfirmOpen && (
          <ModalConfirm
            method="Edit"
            onConfirm={updateMember}
            setModalConfirmOpen={setModalEditConfirmOpen}
            message="Are you sure you want to edit this member?"
          />
        )}

        {modalSuccessOpen && (
          <ModalSuccess
            setModalSuccessOpen={setModalSuccessOpen}
            message="Member updated successfully"
          />
        )}
      </div>
      <div className={styles.titleContainer}>
        <h2 className={styles.letterColour}>Members</h2>
        <div className={styles.addContainer} onClick={handleToggle}>
          <img
            className={styles.imgSize}
            src={`${process.env.PUBLIC_URL}/assets/images/btn-add.png`}
          />
          <p>Add Member</p>
        </div>
      </div>
      {!members.length ? (
        <p>No active Members</p>
      ) : (
        <TableMember
          onUpdateMember={updateMember}
          members={members}
          onDeleteMember={memberDelete}
          showForm={showForm}
          showEditForm={showEditForm}
          handleEditToggle={handleEditToggle}
          setEditForm={setEditForm}
          setModalEditConfirmOpen={setModalEditConfirmOpen}
        />
      )}
    </section>
  );
}

export default Members;
