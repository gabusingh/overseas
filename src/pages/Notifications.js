import React, { useEffect, useState } from "react";
import { getNotification } from "../services/user.service";
import { useGlobalState } from "../GlobalProvider";
import moment from "moment";
function Notifications() {
  const { globalState, setGlobalState } = useGlobalState();
  const [notificationList, setNotificationList] = useState();
  const [notificationType, setNotificationType] = useState("Jobs");
  const getNotificationList = async () => {
    try {
      let response = await getNotification(globalState?.user?.access_token);
      console.log(response?.data);
      setNotificationList(response?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getNotificationList();
  }, []);
  return (
    <div className="container mt-md-5 pt-5">
      <div className="mt-5 py-5 row">
        <div className="col-md-9 col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Notifications</h5>
              <div className="d-flex my-2 mt-3">
                <h6
                  style={{ cursor: "pointer" }}
                  className={
                    "badge me-2 " +
                    (notificationType == "Jobs"
                      ? " bg-primary"
                      : " bg-secondary")
                  }
                  onClick={() => setNotificationType("Jobs")}
                >
                  Jobs
                </h6>
                <h6
                  style={{ cursor: "pointer" }}
                  className={
                    "badge me-2 " +
                    (notificationType == "Applications"
                      ? " bg-primary"
                      : " bg-secondary")
                  }
                  onClick={() => setNotificationType("Applications")}
                >
                  Applications
                </h6>
                <h6
                  style={{ cursor: "pointer" }}
                  className={
                    "badge me-2 " +
                    (notificationType == "Profiles"
                      ? " bg-primary"
                      : " bg-secondary")
                  }
                  onClick={() => setNotificationType("Profiles")}
                >
                  Profiles
                </h6>
              </div>
              <div className="list-group">
                {notificationType == "Jobs" &&
                  notificationList?.newJobs?.map((v, i) => {
                    return (
                      <a
                        href="#"
                        className="list-group-item list-group-item-action"
                      >
                        <h6 className="mb-1">{v?.cmpName}</h6>

                        <p className="mb-1">{v?.fullMessage}</p>
                        <div className="d-flex w-100 justify-content-end">
                          <small className="">
                            {moment(v?.created_at).fromNow()}
                          </small>
                        </div>
                      </a>
                    );
                  })}
                {notificationType == "Applications" &&
                  notificationList?.notifications?.map((v, i) => {
                    return (
                      <a
                        href="#"
                        className="list-group-item list-group-item-action"
                      >
                        <p className="mb-1">{v?.fullMessage}</p>
                        <div className="d-flex w-100 justify-content-end">
                          <small className="">
                            {moment(v?.created_at).fromNow()}
                          </small>
                        </div>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-3 text-center d-md-block d-none">
          <img className="img-fluid" src="/images/fullMobileNew.png" />
          <div className="row mx-2">
            <div className="col-4">
              <img className="img-fluid" src="/images/appQR.png" alt="App Qr"/>
            </div>
            <div className="col-8 my-auto border rounded">
              <img
                className="img-fluid"
                src="https://admin.overseas.ai/newfrontend/image/google-play.png"
                alt="Play Store Image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
