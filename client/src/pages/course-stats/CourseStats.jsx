import React from "react";
import Search from "../../components/utils/Search";
import ItemList from "../../components/utils/ItemList";
import Select from 'react-select';
import * as TimeTableData from "../../Timetable.json";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
console.log(TimeTableData);
const courses = JSON.parse(JSON.stringify(TimeTableData)).default;
console.log(courses);

const CourseStats = props => {
  const [courseData, setCourseData] = React.useState({
    total: 0,
    count: 0,
    initial: courses,
    current: courses,
  });
  const { total, count, initial, current } = courseData;

  const stats = e => {
    if(e===null)
      return;
    console.log(e);
    let event = e.value;
    try {
      axios.get(`/api/courseStats/${event}`).then(res => {
        console.log(res.data);
        setCourseData({
          ...courseData,
          total: res.data.total,
          count: res.data.count,
        });
      });
    } catch (err) {
      window.alert(
        "Couldn't Fetch Data at the moment! Please Try Again Later.",
      );
    }
  };
  function getAtDepth(tt, depth){
      if (depth == 1) {
        return Object.keys(tt).map(function(code){
          return {"value":code , "label":code+" "+tt[code]['name']};
        });
      }
      else return Object.keys(tt).map(function(code){
        return getAtDepth(tt[code], depth-1);
      });
    }
  function filterItems(input) {
    const userInput = input.target.value.toLowerCase();
    let filterCourses = obj =>
      Object.keys(obj)
        .filter(
          item =>
            item.toLowerCase().search(userInput) !== -1 ||
            obj[item]["name"].toLowerCase().search(userInput) !== -1,
        )
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

    let newCourses = filterCourses(initial);
    setCourseData({ ...courseData, current: newCourses });
  }
  return (
    <>
        <Select 
          className="basic-single"
          classNamePrefix="select"
          options={getAtDepth(courses,1)}
          isSearchable
          isClearable
          onChange={stats}
          />
          <br></br>
          <br></br>
          <div 
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center" }}>
              <div style={{width: "10vw",
              height: "10vw"}}>
                <CircularProgressbar
                value={count}
                maxValue={total} 
                text={count}
                strokeWidth={50}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  textColor: "black",
                  pathColor: "#1565c0",
                  trailColor: "#e91e63"
                })}/>
                
              </div>
          </div>
          <br></br>
          <h3 style={{textAlign:"center"}}>Interested Students {count}</h3>
          <h3 style={{textAlign:"center"}}>Total Students {total}</h3>
    </>
  );
};

export default CourseStats;
