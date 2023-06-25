import { useEffect, useState } from 'react';
import { AddButton, Loader, TableComponent, ToastError } from 'Components/Shared';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllActivities, deleteActivity } from 'redux/activities/thunks';

function Activities() {
  const dispatch = useDispatch();
  const activities = useSelector((state) => state.activities.list);
  const isPending = useSelector((state) => state.activities.pending);
  const isError = useSelector((state) => state.activities.error);
  const [toastErroOpen, setToastErroOpen] = useState(isError);
  const history = useHistory();

  useEffect(() => {
    getAllActivities(dispatch);
  }, []);

  useEffect(() => {
    setToastErroOpen(isError);
  }, [isError]);

  const createMode = () => {
    history.push('/admin/activities/form', { params: { mode: 'created' } });
  };

  const handleClick = (item) => {
    history.push(`/admin/activities/form/${item._id}`, { params: { ...item, mode: 'edit' } });
  };

  const columnTitleArray = ['Name', 'Description'];
  const columns = ['name', 'description'];

  return (
    <section>
      <AddButton entity="Activity" createMode={createMode} testId="add-activity-btn" />
      {isPending ? (
        <Loader testId="activity-table-loader" />
      ) : (
        <TableComponent
          columnTitleArray={columnTitleArray}
          data={activities}
          handleClick={handleClick}
          deleteButton={deleteActivity}
          columns={columns}
          testId="activity-table"
        />
      )}
      {toastErroOpen && (
        <ToastError
          setToastErroOpen={setToastErroOpen}
          message="Error in Database"
          testId="activity-list-toast-error"
        />
      )}
    </section>
  );
}

export default Activities;
