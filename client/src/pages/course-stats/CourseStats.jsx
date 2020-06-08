import React from "react";
import { connect } from "react-redux";
import Search from "../../components/utils/Search";
import ItemList from "../../components/utils/ItemList";
import * as TimeTableData from "../../Timetable.json";
import { useGetData } from "use-axios-react";
import axios from "axios";

const courses = JSON.parse(JSON.stringify(TimeTableData)).default;

const CourseStats = props => {
  console.log(props.profDept);
  let profCourses = Object.keys(courses)
    .filter(code => code.startsWith(props.profDept) || code.startsWith("BITS"))
    .reduce((res, key) => ((res[key] = courses[key]), res), {});

  const [courseData, setCourseData] = React.useState({
    total: 0,
    count: 0,
    initial: profCourses,
    current: profCourses,
  });
  const { total, count, initial, current } = courseData;

  const stats = e => {
    e.preventDefault();
    let et = e.target.innerHTML.toLowerCase();
    let event = et.split(" ");
    event = event[0] + " " + event[1];
    console.log(event);

    // try {
    //   axios.get(`/api/helData/searchHEL/${event}`).then(res => {
    //     resp = true;
    //     result = res.data.studentsInterestedInAllSlots;

    //     let newCSarray = [];
    //     if (result) {
    //       for (let i = 0; i < 8; i++) {
    //         newCSarray.push({ x: i + 1, y: result[i] });
    //       }
    //     }
    //     setStudentData({ ...studentData, courseStats: newCSarray });
    //   });
    // } catch (err) {
    //   console.log("DB RETRIEVAL ERROR:", err);
    // }
    // if (courseStats.length === 0) return false;
    // //courseData = et;
    // return true;
  };

  function filterItems(input) {
    const userInput = input.target.value.toLowerCase();
    console.log(userInput);
    let filterCourses = obj =>
      Object.keys(obj)
        .filter(
          item =>
            item.toLowerCase().search(userInput) !== -1 ||
            obj[item]["name"].toLowerCase().search(userInput) !== -1,
        )
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

    let newCourses = filterCourses(initial);
    setCourseData({ ...courseData, current: newCourses }); //force component update
  }

  let str = [
    <div style={{ float: "right", width: "35%" }}>
      <Search action={filterItems} />
      <ItemList
        items={current}
        action={e => {
          stats(e);
        }}
      />
    </div>,
  ];
  // //const [, loading] = useGetData("/api/heldata/searchHEL/:name");
  // if (!loading) {

  // }
  return <>{str}</>;
};

const mapStateToProps = state => {
  return {
    profDept: state.auth.user.department,
  };
};

//   const mapDispatchToProps = (dispatch) => {
//     return {
//       clearAll: () => dispatch(clearAll()),
//     };
//   };

//   CourseStats.propTypes = {
//     id: PropTypes.object,
//     myCourses: PropTypes.array,
//     openDialog: PropTypes.func.isRequired,
//     clearAll: PropTypes.func.isRequired,
//     save: PropTypes.func.isRequired,
//   };

export default connect(mapStateToProps, null)(CourseStats);
