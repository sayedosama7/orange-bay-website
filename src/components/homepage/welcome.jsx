import React from 'react';
import "../../css/welcome.css";
const Welcome =() => {
return (
<div className="container popular-section">
  <div className="row mb-5">
    <div className="col-md-6">
      <h2 className="section-title"><span className="text-dark">Welcome</span> to Orange Bay</h2>
      <p className="section-description">
        Orange Bay is a stunning natural bay in the ecologically protected island of Giftun.
        <br /> <br /> 
        The island is surrounded by unspoiled coral reefs, impressive marine life species, and white sandy beaches.
        The shallow crystal-clear turquoise sea stretches for almost one and a half KM and has a maximum depth of five M, making it an ideal spot to float away your worries.
        <br /> <br />
        It is located just forty minutes by boat from the new marina in 
        <br />Hurghada.
      </p>
      </div>
    <div className="col-md-6 mt-4 ">
      <div className="row">
        <div className="col-sm-6 top-left">
          <img src="image 5.png" alt="img 1" className="img-fluid" />
        </div>
        <div className="col-sm-6 mb-3 top-right">
          <img src="image 2.png" alt="img 2" className="img-fluid" />
        </div>
        <div className="col-sm-12 bottom-left">
          <img src="w3.png" alt="img 3" className="img-fluid" />
        </div>
      </div>
    </div>
  </div>
</div>

)
}
export default Welcome ; 