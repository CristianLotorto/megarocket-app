import {
  getActivitiesPending,
  getActivitiesSuccess,
  getActivitiesError,
  deleteActivitiesPending,
  deleteActivitiesSuccess,
  deleteActivitiesError,
  addActivitiesPending,
  addActivitiesSuccess,
  addActivitiesError,
  updateActivitiesPending,
  updateActivitiesSuccess,
  updateActivitiesError
} from './actions';

export const getAllActivities = async (dispatch) => {
  try {
    dispatch(getActivitiesPending(true));
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activity`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      const newData = data.data;
      dispatch(getActivitiesPending(false));
      dispatch(getActivitiesSuccess(newData));
    } else {
      dispatch(getActivitiesPending(false));
      dispatch(getActivitiesError(true));
    }
  } catch (error) {
    dispatch(getActivitiesPending(false));
    dispatch(getActivitiesError(true));
    console.error(error);
  }
};

export const deleteActivity = (activityId) => {
  return async (dispatch) => {
    try {
      dispatch(deleteActivitiesPending(true));
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activity/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        dispatch(deleteActivitiesPending(false));
        dispatch(deleteActivitiesError(false));
        dispatch(deleteActivitiesSuccess(activityId));
      }
    } catch (error) {
      dispatch(deleteActivitiesPending(false));
      dispatch(deleteActivitiesError(true));
      console.error(error);
    }
  };
};

export const addActivity = async (dispatch, newActivity) => {
  try {
    dispatch(addActivitiesPending(true));
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newActivity)
    });
    if (response.ok) {
      const data = await response.json();
      const newData = data;
      dispatch(addActivitiesSuccess(newData));
      dispatch(addActivitiesPending(false));
    } else {
      dispatch(addActivitiesError(true));
      dispatch(addActivitiesPending(false));
    }
  } catch (error) {
    dispatch(addActivitiesPending(false));
    dispatch(addActivitiesError(true));
    console.error(error);
  }
};

export const updateActivity = async (dispatch, id, activity) => {
  try {
    dispatch(updateActivitiesPending(true));
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/activity/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(activity)
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(updateActivitiesPending(false));
      dispatch(updateActivitiesSuccess(data.result));
    } else {
      dispatch(addActivitiesError(true));
      dispatch(addActivitiesPending(false));
    }
  } catch (error) {
    dispatch(updateActivitiesPending(false));
    dispatch(updateActivitiesError(true));
    console.error(error);
  }
};
