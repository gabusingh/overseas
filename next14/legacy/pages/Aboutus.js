import React from "react";

function Aboutus() {
  const arr = [
    {
      title: "About Us Overseas",
      discription:
        "We connect employers and job-seekers across borders through the power of Video. We go beyond traditional resumes and cover letters and utilize authentic videos to establish the credentials of the blue and grey-collar workers to prospective employers.",
    },
    {
      title: "Our Mission",
      discription:
        "Changing the functioning of blue and grey-collar recruitment across the border by leveraging the power of video. We expect capable, skilled and ambitious workers to get due benefits by demonstrating their skills and talents.",
    },
    {
      title: "Our Vission",
      discription:
        "To become a well-renowned platform connecting overseas employers and employees in the blue and grey-collar sectors, transforming the global recruitment process. We envision a future where Overseas employers can easily identify and connect with the best talents across borders.",
    },
  ];
  return (
    <div className="mt-5 pt-md-5">
      <div className="mt-5 pt-5 container">
        <div className="py-3 border  rounded shadow-sm">
          <h1 className=" textBlue text-center">
            Know Overseas.ai, Our Mission & Vision and Areas of Impact
          </h1>
        </div>
        <div className="row justify-content-between">
          <div className="col-lg-6 col-md-12 col-12 my-5">
            <div className="mt-4">
              {arr?.map((v, i) => {
                return (
                  <div className="mb-5">
                    <h3 className="textBlue">{v?.title}</h3>
                    <h5 className="text-secondary">{v?.discription}</h5>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-lg-5 col-md-12 col-12 my-auto">
            <img src="/images/about.png" className="img-fluid" />
          </div>
        </div>
        <div className="my-5">
        <h2 className=" textBlue my-4">
        Areas of Impact
          </h2>
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button textBlue"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                  style={{fontSize:"23px", fontWeight:"500"}} 
                >
                  Productive Use of Time
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  Interestingly, most informal sector workers spent their time
                  surfing videos on different social media (Facebook, Tik Tok,
                  Instagram etc), an activity that may not be socioeconomically
                  productive for the individual or the population. We envisage
                  that a major part of their spare time can be used in observing
                  and creating these work videos which will make them engaged
                  with this platform and help them cross-learning. Our platform
                  will provide an alternative work + entertainment opportunity
                  where the users can use their time productively.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed textBlue"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                  style={{fontSize:"23px", fontWeight:"500"}} 
                >
                  Skill-based connection building & learning opportunity
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  The target group is mostly unconnected as they are not users
                  of professional social media platforms like LinkedIn. A
                  platform like LinkedIn is primarily meant for whitecollar/
                  educated workers. The proposed video-based cross-learning
                  platform will allow individuals with a similar skill set to be
                  connected, learn from each other, and employers to hire
                  individuals.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed textBlue"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                  style={{fontSize:"23px", fontWeight:"500"}} 
                >
                  Encouraging International Migration for the targeted segment
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  Skilled workers with low education have limited opportunities
                  for temporary migration. For example, India/Bangladesh/the
                  Philippines supply construction workers, nurses etc to middle
                  eastern countries and some extent to Europe. Usually, foreign
                  employers have limited opportunities to evaluate the skill set
                  of prospective hires. Such a video platform showcasing various
                  facets of the skill set of the candidates may be quite helpful
                  in this regard. We are already piloting our prototype portal
                  to address this issues
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFour">
                <button
                  class="accordion-button collapsed textBlue"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                  style={{fontSize:"23px", fontWeight:"500"}} 
                >
                  A new market for tools and technologies
                </button>
              </h2>
              <div
                id="collapseFour"
                class="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  The network building and new learning possibilities may have
                  spillover outcomes in terms of opening up the market for tools
                  and technologies. The target segment, siloed in their local
                  economy, is hardly aware of the tools and technologies
                  available in other economies for performing the same task.
                  This initiative may provide a drive to the target groups
                  engaged in occupations like farming, plumbing, nursing, and
                  welding (just to name a few) to reorient their work plan due
                  to new knowledge about the tools and technologies available
                  elsewhere in the world.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFive">
                <button
                  class="accordion-button collapsed textBlue"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFive"
                  aria-expanded="false"
                  aria-controls="collapseFive"
                  style={{fontSize:"23px", fontWeight:"500"}} 
                >
                  A new market for handicrafts and other niche skill sets
                </button>
              </h2>
              <div
                id="collapseFive"
                class="accordion-collapse collapse"
                aria-labelledby="headingFive"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  Similarly, various niche skill sets that might be valued
                  globally and yet confined in the local economy, might get
                  access to the global market. There are excellent skill sets
                  (for example, handicrafts or organic production) that may get
                  global attention if they get the necessary exposure.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
