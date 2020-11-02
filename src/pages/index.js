import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";
import style from './index.module.css';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";

const IndexPage = () => {
  const [selectedCountry, setSelectedCountry] = useState("india")
  const [globalCount, setGlobalCount] = useState(0);
  const [countries, setCountries] = useState([]);
  const [currentCases, setCurrentCases] = useState(0);
  const [casesPerday, setCasesPerday] = useState(0);
  const [increaseinPerYestdy, setIncreaseinPerYestdy] = useState(0);
  const [increaseinPerWeek, setIncreaseinPerWeek] = useState(0);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    axios.get(`https://api.covid19api.com/summary`, {}, { "X-Access-Token": "5cf9dfd5-3449-485e-b5ae-70a60e997864" })
      .then(res => {
        setCountries(res.data.Countries);
        setGlobalCount(res.data.Global.TotalConfirmed);
      }).catch(err => console.log("err", err));
  }, []);

  useEffect(() => {
    seletedCountryCases();
  }, [selectedCountry])

  const seletedCountryCases = () => {
    setLoader(true);
    axios.get(`https://api.covid19api.com/dayone/country/${selectedCountry}/status/confirmed`)
      .then(res => {
        getCaseParams(res.data);
        setLoader(false);
      }).catch(err => console.log("err", err));
  }

  const getSelectedDate = (counter) => {
    let today = new Date();
    let date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - counter);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return date.getFullYear() + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T00:00:00Z";
  }

  const getCaseParams = (array) => {
    setCurrentCases(array[array.length - 1].Cases)
    setCasesPerday((array[array.length - 1].Cases / array.length));
    setIncreaseinPerYestdy(((array[array.length - 1].Cases - array[array.length - 2].Cases) / array[array.length - 2].Cases) * 100);
    var d = new Date();
    var day = d.getDay();
    setIncreaseinPerWeek(((array[array.length - 1].Cases - array[array.length - 8].Cases) / array[array.length - 8].Cases) * 100);
    // setIncreaseinPerWeek(((array[array.length - 1].Cases-array[array.length - (day + 1)].Cases) / array[array.length - (day + 1)].Cases) * 100);

  }
  const onCountrySelet = (e) => {
    setSelectedCountry(e.target.value);
  }
  return (
    <Layout>
      <SEO title="Home" />
      {loader ? <div className={style.overlay}>
        <div class={style.loader}></div>
      </div> : null}
      <div className={style.container}>
        <div className={style.total}>
          <span style={{ "fontSize": "35px", "fontWeight": "bold" }}>Caronavirus cases</span>
          <span className={style.value}>{globalCount.toLocaleString()}</span>
        </div>
        <div className={style.countries} >
          <label>select country-</label>
          <select value={selectedCountry} style={{ "width": "100px" }} onChange={e => onCountrySelet(e)}>
            {countries.map(ele => <option value={ele.Slug}>{ele.Country}</option>)}
          </select>
        </div>
        <div className={style.details}>
          <span className={style.label}>Cases</span>
          <span className={style.value}>{currentCases.toLocaleString()}</span>
          <span className={style.label}>Patients/Day</span>
          <span className={style.value}>{casesPerday.toFixed(0)}</span>
          <span className={style.label}>Increase in percentage since yesterday</span>
          <span className={style.value}>{increaseinPerYestdy.toFixed(0)}%</span>
          <span className={style.label}>Increase in percentage since week</span>
          <span className={style.value}>{increaseinPerWeek.toFixed(0)}%</span>
        </div>

      </div>
    </Layout >
  )
}
export default IndexPage


  // < h1 > Hi people</h1 >
  //   <p>Welcome to your new Gatsby site.</p>
  //   <p>Now go build something great.</p>
  //   <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
  //     <Image />
  //   </div>
  //   <Link to="/page-2/">Go to page 2</Link> <br />
  //   <Link to="/using-typescript/">Go to "Using TypeScript"</Link>