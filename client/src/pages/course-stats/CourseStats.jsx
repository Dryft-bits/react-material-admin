import React from "react";
import Search from "../../components/utils/Search";
import ItemList from "../../components/utils/ItemList";
import * as TimeTableData from "../../Timetable.json";
import axios from "axios";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/core";

const courses = JSON.parse(JSON.stringify(TimeTableData)).default;

const CourseStats = props => {
  const [courseData, setCourseData] = React.useState({
    total: 0,
    count: 0,
    initial: courses,
    current: courses,
  });
  const { total, count, initial, current } = courseData;

  const stats = e => {
    e.preventDefault();
    let et = e.target.innerHTML;
    let event = et.split(" ");
    event = event[0] + " " + event[1];
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
        "Couldn't Fetch Data at the momnet! Please Try Again Later.",
      );
    }
  };

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
      {total ? (
        <div align="left">
          <CircularProgress value={count} max={total} color="blue" size="25em">
            <CircularProgressLabel>{count}</CircularProgressLabel>
          </CircularProgress>
          <h3>Interested Students {count}</h3>
          <h3>Total Students {total}</h3>
        </div>
      ) : null}{" "}
      <div style={{ float: "right", width: "35%" }}>
        <Search action={filterItems} />
        <ItemList
          items={current}
          action={e => {
            stats(e);
          }}
        />
      </div>
      ,
    </>
  );
};

export default CourseStats;
