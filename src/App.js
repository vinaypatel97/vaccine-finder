import { useState, useEffect } from 'react';

const App = () => {

  const [vaccineData, setVaccineData] = useState();

  function getDate() {

    let today = new Date();
    let dateObj = new Date(today);
    dateObj.setDate(dateObj.getDate() + 1);
    let month = dateObj.getMonth() + 1;
    if (`${month}`.length === 1) {
      month = `0${month}`;
    }
    return `${dateObj.getDate()}-${month}-${dateObj.getFullYear()}`;
  }

  function getVaccinDetails() {
    const currDate = getDate();
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=770&date=${currDate}`;
    fetch(url).then(res => res.json()).then((data) => {
      setVaccineData(data && data.centers)
    })
  }

  useEffect(() => {
    getVaccinDetails();
    setInterval(() => {
      getVaccinDetails();
    }, 3000)
  }, [])

  return (
    <div className="App">
      <h2>🚀 Vaccine Finder 🚀</h2>
      <h5>Constantly Searching...</h5>
      <div className="loaderWrap">
        <div className="loader"></div>
      </div>
      <table>
        <tr>
          <th>Name</th>
          <th>Pincode</th>
          <th>Age Limit</th>
          <th>Free/Paid</th>
          <th>Vaccine Count Available</th>
        </tr>
        {
          vaccineData && vaccineData.map((obj, index) => {
            if (obj.sessions[0].available_capacity > 0) {
              return (
                <tr key={index}>
                  <td>{obj.address}</td>
                  <td>{obj.pincode}</td>
                  <td>{obj.sessions[0].min_age_limit}</td>
                  <td>{obj.fee_type}</td>
                  <td>{obj.sessions[0].available_capacity}</td>
                </tr>
              )
            }
            return null;
          })
        }
      </table>
    </div>
  );
}

export default App;
