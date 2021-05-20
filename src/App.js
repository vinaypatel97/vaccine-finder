import { useState, useEffect } from 'react';

const App = () => {

  const [vaccineData, setVaccineData] = useState();
  const [cityCode, setCityCode] = useState('770');
  const [day, setDay] = useState(getToday());
  const [interval, setCustomInterval] = useState('770');

  function getTomorrow() {

    let today = new Date();
    let dateObj = new Date(today);
    dateObj.setDate(dateObj.getDate() + 1);
    let month = dateObj.getMonth() + 1;
    if (`${month}`.length === 1) {
      month = `0${month}`;
    }
    return `${dateObj.getDate()}-${month}-${dateObj.getFullYear()}`;
  }

  function getToday() {

    let dateObj = new Date();
    let month = dateObj.getMonth() + 1;
    if (`${month}`.length === 1) {
      month = `0${month}`;
    }
    return `${dateObj.getDate()}-${month}-${dateObj.getFullYear()}`;
  }

  function getVaccinDetails() {
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${cityCode}&date=${day}`;
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        setVaccineData(data && data.centers)
      })
      .catch((error) => {
        console.error('error: ', error);
        setVaccineData([]);
      })
  }

  function startInterval() {
    const interval = setInterval(() => {
      getVaccinDetails();
    }, 3000)
    setCustomInterval(interval);
  }

  useEffect(() => {
    getVaccinDetails();
    startInterval();
    return clearInterval(interval)
  }, [cityCode, day])

  const onChangeHandler = (e, type) => {
    clearInterval(interval);
    setVaccineData([]);
    if (type === 'city') {
      setCityCode(e.target.value)
    } else if (type === 'day') {
      setDay(e.target.value)
    }
  }

  return (
    <div className="App">
      <h2>💉 Vaccine Finder [₲Ĵ] 💉</h2>
      <h5>Constantly Searching...</h5>
      <div className="loaderWrap">
        <div className="loader"></div>
      </div>
      <div className="selectWrap">
        <div className="select" style={{ "width": "100%" }}>
          <select onChange={(e) => onChangeHandler(e, 'city')} defaultValue={cityCode}>
            <option defaultValue value="770">Ahmedabad Corpora..</option>
            <option value="154">Ahmedabad</option>
            <option value="179">Anand</option>
            <option value="175">Bhavnagar</option>
            <option value="153">Gandhinagar</option>
            <option value="772">Gandhinagar Corpora..</option>
            <option value="160">Mehsana</option>
            <option value="173">Rajkot</option>
            <option value="775">Rajkot Corpora..</option>
            <option value="165">Surat</option>
            <option value="776">Surat Corpora..</option>
            <option value="157">Surendranagar</option>
          </select>
          <div className="select__arrow"></div>
        </div>

        <div className="select" style={{ "width": "60%" }}>
          <select onChange={(e) => onChangeHandler(e, 'day')} defaultValue={day}>
            <option defaultValue value={getToday()}>Today</option>
            <option value={getTomorrow()}>Tomorrow</option>
          </select>
          <div className="select__arrow"></div>
        </div>
      </div>
      <table>
        <tr>
          <th>Name(AV)</th>
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
                  <td>{`${obj.name} ${obj.address}`}</td>
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
