import React from "react";
import CountUp from 'react-countup';
function Statics() {
  const data = [
    {
      title: "Job Seeker",
      count: 200,
      icon: "fa fa-user",
    },
    {
        title: "Jobs Posted",
        count: 500,
        icon: "fa fa-suitcase",
      },
      {
        title: "Our HRA",
        count: 200,
        icon: "fa fa-tasks",
      },
      {
        title: "Institute",
        count: 200,
        icon: "fa fa-graduation-cap",
      },
  ];
  return (
    <div className="rounded bg-light shadow  row m-0" >
      {data?.map((v, i) => {
        return (
          <div className="col-lg-3 col-md-4 col-6 helveticaFont ">
            <div className="m-lg-5 m-md-3 m-1 text-center  p-2">
              <h2 className="mb-0">
              <i className={`p-3 text-secondary rounded ${v?.icon}`}></i>
              </h2>
              <p className="mb-1 "><b><CountUp delay={0.5} end={v?.count} /></b></p>
              <h6 className="textBlue"><b>{v?.title}</b></h6>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Statics;
