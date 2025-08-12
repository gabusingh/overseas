import React, { useEffect, useState } from "react";
import { getHraNotification } from "../../services/hra.service";
import { useGlobalState } from "../../GlobalProvider";
import moment from "moment";
function NotificationList() {
  const { globalState, setGlobalState } = useGlobalState();
  const [notificationList, setNotificationList] = useState();

  const getHraNotificationList = async () => {
    try {
      let response = await getHraNotification(globalState?.user?.access_token);
      setNotificationList(response?.data?.notifications);
    } catch (error) {}
  };
  useEffect(() => {
    getHraNotificationList();
  }, []);
  return (
    <div className="container mt-md-5 pt-5">
      <div className="mt-5 py-5 row">
        <div className="col-md-9 col-12">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Notifications</h5>

              <div className="list-group">
                {notificationList?.map((v, i) => {
                  return (
                    <a
                      href="#"
                      className="list-group-item list-group-item-action d-flex align-items-end pt-3"
                    >
                      <div>
                        <h5 className="mb-1 ">
                          <span className="badge text-dark bg-light">{v?.subject}</span>
                        </h5>

                        <h4 className="my-3 text-secondary ms-2">
                          <i className="fa fa-user"></i> {v?.userName}
                        </h4>
                        <p className="mb-1 ">{v?.jobName}</p>
                      </div>
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
              <img className="img-fluid" src="/images/appQR.png" alt="App Qr" />
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

export default NotificationList;
